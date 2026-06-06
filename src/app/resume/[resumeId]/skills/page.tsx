'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getResumeAPI, updateResumeAPI } from '@/apis/resume.api';
import { generateSkillsAPI } from '@/apis/ai.api';
import AiGenerateButton from '@/components/AiGenerateButton';

export default function SkillsPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);
  const { register, handleSubmit, reset, getValues, setValue, watch, formState: { errors } } = useForm<{ skills: string[], certifications: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [prevSkills, setPrevSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          setResumeData(response.data);
          reset({
            skills: response.data.skills || [],
            certifications: (response.data.certifications || []).join(', ')
          });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch resume data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, reset]);

  const onSubmit = async (data: { skills: string[], certifications: string }) => {
    try {
      setIsSaving(true);
      setError('');
      const skillsArray = data.skills || [];
      const certsArray = data.certifications.split(',').map(s => s.trim()).filter(Boolean);
      
      const response = await updateResumeAPI(resumeId, { 
        skills: skillsArray, 
        certifications: certsArray 
      });

      if (response.success) {
        router.push(`/resume/${resumeId}/preview`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save skills & certifications.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-6">Skills & Certifications</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86]">Skills</label>
              <AiGenerateButton
                onGenerate={async () => {
                  setPrevSkills(getValues('skills') || []);
                  const res = await generateSkillsAPI({
                    experienceLevel: resumeData?.experienceLevel || 'Beginner',
                    jobTitle: resumeData?.jobTitle || 'Software Engineer'
                  });
                  if (res.success && res.data?.skills) return res.data.skills;
                  throw new Error('Failed to generate skills');
                }}
                onSuccess={(skills) => setValue('skills', skills, { shouldDirty: true, shouldValidate: true })}
                onRevert={() => setValue('skills', prevSkills, { shouldDirty: true, shouldValidate: true })}
                onError={setError}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(watch('skills') || []).map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-[#DF894A]/20 text-[#4A2E1B] dark:text-[#ECBA86] px-3 py-1 rounded-full text-sm font-medium border border-[#DF894A]/30">
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const current = getValues('skills') || [];
                      const updated = [...current];
                      updated.splice(index, 1);
                      setValue('skills', updated, { shouldDirty: true, shouldValidate: true });
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
              placeholder="Type a skill and press Enter"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newSkill.trim()) {
                    const current = getValues('skills') || [];
                    if (!current.includes(newSkill.trim())) {
                        setValue('skills', [...current, newSkill.trim()], { shouldDirty: true, shouldValidate: true });
                    }
                    setNewSkill('');
                  }
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Certifications (comma separated)</label>
            <textarea
              rows={4}
              placeholder="e.g. AWS Certified Developer, Google UX Design"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('certifications')}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-[#DF894A]/20">
          <button
            type="button"
            onClick={() => router.push(`/resume/${resumeId}/projects`)}
            className="py-2 px-6 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] font-semibold transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Finish & Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
