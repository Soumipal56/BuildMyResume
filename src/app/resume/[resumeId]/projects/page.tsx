'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getResumeAPI, updateResumeAPI } from '@/apis/resume.api';
import { IProjects } from '@/types/resume.types';
import AiImproveButton from '@/components/AiImproveButton';
import AiGenerateButton from '@/components/AiGenerateButton';
import { generateProjectDescriptionAPI, generateProjectTechStackAPI } from '@/apis/ai.api';

export default function ProjectsPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);
  const { register, control, handleSubmit, reset, getValues, setValue, watch, formState: { errors } } = useForm<{ projects: any[] }>({
    defaultValues: { projects: [] }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [prevDescriptions, setPrevDescriptions] = useState<Record<number, string>>({});
  const [prevTechStacks, setPrevTechStacks] = useState<Record<number, string[]>>({});
  const [newTechStacks, setNewTechStacks] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          setResumeData(response.data);
          const formattedProjects = (response.data.projects || []).map((proj: IProjects) => ({
            ...proj,
            techStack: proj.techStack || []
          }));
          reset({ projects: formattedProjects });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch resume data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, reset]);

  const onSubmit = async (data: { projects: any[] }) => {
    try {
      setIsSaving(true);
      setError('');
      const formattedProjects = data.projects.map((proj: any) => ({
        ...proj,
        techStack: proj.techStack || []
      }));
      const response = await updateResumeAPI(resumeId, { projects: formattedProjects });
      if (response.success) {
        router.push(`/resume/${resumeId}/skills`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save projects info.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-6">Projects</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border border-[#DF894A]/30 rounded-lg bg-white/50 dark:bg-[#3E271D]/50 relative">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-semibold"
            >
              ✕ Remove
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Project Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`projects.${index}.title`, { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Live URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`projects.${index}.liveUrl`)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">GitHub URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`projects.${index}.githubUrl`)}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86]">Tech Stack</label>
                  <AiGenerateButton 
                    onGenerate={async () => {
                      setPrevTechStacks(prev => ({ ...prev, [index]: getValues(`projects.${index}.techStack`) || [] }));
                      const title = getValues(`projects.${index}.title`);
                      const description = getValues(`projects.${index}.description`);
                      const res = await generateProjectTechStackAPI({
                        projectTitle: title || 'Project',
                        projectDescription: description || ''
                      });
                      if (res.success && res.data?.techStack) return res.data.techStack;
                      throw new Error('Failed to generate tech stack');
                    }}
                    onSuccess={(techStack) => setValue(`projects.${index}.techStack`, techStack, { shouldDirty: true, shouldValidate: true })}
                    onRevert={() => setValue(`projects.${index}.techStack`, prevTechStacks[index] || [], { shouldDirty: true, shouldValidate: true })}
                    onError={setError}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(watch(`projects.${index}.techStack`) || []).map((tech: string, i: number) => (
                    <div key={i} className="flex items-center gap-1 bg-[#DF894A]/20 text-[#4A2E1B] dark:text-[#ECBA86] px-3 py-1 rounded-full text-sm font-medium border border-[#DF894A]/30">
                      {tech}
                      <button
                        type="button"
                        onClick={() => {
                          const current = getValues(`projects.${index}.techStack`) || [];
                          const updated = [...current];
                          updated.splice(i, 1);
                          setValue(`projects.${index}.techStack`, updated, { shouldDirty: true, shouldValidate: true });
                        }}
                        className="hover:text-red-500 transition-colors ml-1 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a technology and press Enter"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  value={newTechStacks[index] || ''}
                  onChange={(e) => setNewTechStacks(prev => ({ ...prev, [index]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newTechStacks[index]?.trim();
                      if (val) {
                        const current = getValues(`projects.${index}.techStack`) || [];
                        if (!current.includes(val)) {
                            setValue(`projects.${index}.techStack`, [...current, val], { shouldDirty: true, shouldValidate: true });
                        }
                        setNewTechStacks(prev => ({ ...prev, [index]: '' }));
                      }
                    }
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86]">Description</label>
                  <div className="flex gap-3 items-center">
                    <AiGenerateButton 
                      onGenerate={async () => {
                        setPrevDescriptions(prev => ({ ...prev, [index]: getValues(`projects.${index}.description`) }));
                        const techStackArray = getValues(`projects.${index}.techStack`) || [];
                        const res = await generateProjectDescriptionAPI({
                          experienceLevel: resumeData?.experienceLevel || 'Beginner',
                          jobTitle: resumeData?.jobTitle || 'Software Engineer',
                          techStack: techStackArray
                        });
                        if (res.success && res.data?.projectDescription) return res.data.projectDescription;
                        throw new Error('Failed to generate description');
                      }}
                      onSuccess={(desc) => setValue(`projects.${index}.description`, desc, { shouldDirty: true, shouldValidate: true })}
                      onRevert={() => setValue(`projects.${index}.description`, prevDescriptions[index] || '', { shouldDirty: true, shouldValidate: true })}
                      onError={setError}
                    />
                    <AiImproveButton 
                      currentContent={watch(`projects.${index}.description`)}
                      onImprove={(improved) => setValue(`projects.${index}.description`, improved, { shouldDirty: true, shouldValidate: true })}
                      onError={setError}
                    />
                  </div>
                </div>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`projects.${index}.description`)}
                ></textarea>
              </div>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={() => append({ title: '', description: '', githubUrl: '', liveUrl: '', techStack: '' })}
            className="text-[#DF894A] hover:text-[#4A2E1B] dark:text-[#ECBA86] dark:hover:text-[#DF894A] font-medium text-sm transition-colors"
          >
            + Add Project
          </button>
        </div>

        <div className="flex justify-between pt-4 border-t border-[#DF894A]/20">
          <button
            type="button"
            onClick={() => router.push(`/resume/${resumeId}/experience`)}
            className="py-2 px-6 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] font-semibold transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Next: Skills & Certifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
