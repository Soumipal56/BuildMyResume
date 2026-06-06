'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getResumeAPI, updateResumeAPI } from '@/apis/resume.api';
import { IPersonalInfo } from '@/types/resume.types';

export default function PersonalInfoPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ personalInfo: IPersonalInfo }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          reset({ personalInfo: response.data.personalInfo || {} });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch resume data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, reset]);

  const onSubmit = async (data: { personalInfo: IPersonalInfo }) => {
    try {
      setIsSaving(true);
      setError('');
      const response = await updateResumeAPI(resumeId, { personalInfo: data.personalInfo });
      if (response.success) {
        router.push(`/resume/${resumeId}/summary`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save personal info.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-6">Personal Information</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.fullname')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.email')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Mobile Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.mobile')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Location / Address</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.location')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">LinkedIn URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.linkedIn')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">GitHub URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.github')}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Portfolio Website</label>
            <input
              type="url"
              className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
              {...register('personalInfo.portfolio')}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Next: Summary'}
          </button>
        </div>
      </form>
    </div>
  );
}
