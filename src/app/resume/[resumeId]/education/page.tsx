'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getResumeAPI, updateResumeAPI } from '@/apis/resume.api';
import { IEducation } from '@/types/resume.types';

export default function EducationPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<{ education: IEducation[] }>({
    defaultValues: { education: [] }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          reset({ education: response.data.education || [] });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch resume data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, reset]);

  const onSubmit = async (data: { education: IEducation[] }) => {
    try {
      setIsSaving(true);
      setError('');
      const response = await updateResumeAPI(resumeId, { education: data.education });
      if (response.success) {
        router.push(`/resume/${resumeId}/experience`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save education info.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-6">Education Background</h2>
      
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
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Institute / University</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`education.${index}.institute`, { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Degree</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`education.${index}.degree`, { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Start Date</label>
                <input
                  type="month"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`education.${index}.startDate`)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">End Date</label>
                <input
                  type="month"
                  className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                  {...register(`education.${index}.endDate`)}
                />
              </div>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={() => append({ institute: '', degree: '', startDate: '', endDate: '' })}
            className="text-[#DF894A] hover:text-[#4A2E1B] dark:text-[#ECBA86] dark:hover:text-[#DF894A] font-medium text-sm transition-colors"
          >
            + Add Education
          </button>
        </div>

        <div className="flex justify-between pt-4 border-t border-[#DF894A]/20">
          <button
            type="button"
            onClick={() => router.push(`/resume/${resumeId}/summary`)}
            className="py-2 px-6 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] font-semibold transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Next: Experience'}
          </button>
        </div>
      </form>
    </div>
  );
}
