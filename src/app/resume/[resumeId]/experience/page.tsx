'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getResumeAPI, updateResumeAPI } from '@/apis/resume.api';
import { IWorkExperience } from '@/types/resume.types';
import AiImproveButton from '@/components/AiImproveButton';
import AiGenerateButton from '@/components/AiGenerateButton';
import { generateExperienceDescriptionAPI } from '@/apis/ai.api';

export default function ExperiencePage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);
  const { register, control, handleSubmit, reset, getValues, setValue, watch, formState: { errors } } = useForm<{ workExperience: IWorkExperience[] }>({
    defaultValues: { workExperience: [] }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [prevDescriptions, setPrevDescriptions] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          setResumeData(response.data);
          reset({ workExperience: response.data.workExperience || [] });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch resume data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, reset]);

  const onSubmit = async (data: { workExperience: IWorkExperience[] }) => {
    try {
      setIsSaving(true);
      setError('');
      const response = await updateResumeAPI(resumeId, { workExperience: data.workExperience });
      if (response.success) {
        router.push(`/resume/${resumeId}/projects`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save experience info.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-6">Work Experience</h2>
      
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
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`workExperience.${index}.company`, { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Position / Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`workExperience.${index}.position`, { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Start Date</label>
                <input
                  type="month"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`workExperience.${index}.startDate`)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">End Date</label>
                <input
                  type="month"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`workExperience.${index}.endDate`)}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86]">Description</label>
                  <div className="flex gap-3 items-center">
                    <AiGenerateButton 
                      onGenerate={async () => {
                        setPrevDescriptions(prev => ({ ...prev, [index]: getValues(`workExperience.${index}.description`) }));
                        
                        const start = getValues(`workExperience.${index}.startDate`);
                        const end = getValues(`workExperience.${index}.endDate`);
                        let yearsOfExperience = 0;
                        if (start && end) {
                          const startYear = new Date(start).getFullYear();
                          const endYear = new Date(end).getFullYear();
                          yearsOfExperience = Math.max(1, endYear - startYear);
                        } else {
                          yearsOfExperience = 1;
                        }

                        const res = await generateExperienceDescriptionAPI({
                          experienceLevel: resumeData?.experienceLevel || 'Beginner',
                          jobRole: getValues(`workExperience.${index}.position`) || resumeData?.jobTitle || 'Software Engineer',
                          yearsOfExperience,
                          techStack: resumeData?.skills || []
                        });
                        if (res.success && res.data?.experienceDescription) return res.data.experienceDescription;
                        throw new Error('Failed to generate description');
                      }}
                      onSuccess={(desc) => setValue(`workExperience.${index}.description`, desc, { shouldDirty: true, shouldValidate: true })}
                      onRevert={() => setValue(`workExperience.${index}.description`, prevDescriptions[index] || '', { shouldDirty: true, shouldValidate: true })}
                      onError={setError}
                    />
                    <AiImproveButton 
                      currentContent={watch(`workExperience.${index}.description`)}
                      onImprove={(improved) => setValue(`workExperience.${index}.description`, improved, { shouldDirty: true, shouldValidate: true })}
                      onError={setError}
                    />
                  </div>
                </div>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`workExperience.${index}.description`)}
                ></textarea>
              </div>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '' })}
            className="text-[#DF894A] hover:text-[#4A2E1B] dark:text-[#ECBA86] dark:hover:text-[#DF894A] font-medium text-sm transition-colors"
          >
            + Add Experience
          </button>
        </div>

        <div className="flex justify-between pt-4 border-t border-[#DF894A]/20">
          <button
            type="button"
            onClick={() => router.push(`/resume/${resumeId}/education`)}
            className="py-2 px-6 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] font-semibold transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Next: Projects'}
          </button>
        </div>
      </form>
    </div>
  );
}
