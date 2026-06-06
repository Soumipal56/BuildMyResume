'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getResumeAPI, updateResumeAPI } from '@/apis/resume.api';
import { getAtsScoreAPI } from '@/apis/ai.api';
import { generateSummaryAPI } from '@/apis/ai.api';
import AiImproveButton from '@/components/AiImproveButton';
import AiGenerateButton from '@/components/AiGenerateButton';

export default function SummaryPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);
  const { register, handleSubmit, reset, getValues, setValue, watch, formState: { errors } } = useForm<{ title: string, summary: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [atsScoreResult, setAtsScoreResult] = useState('');
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);
  const [prevSummary, setPrevSummary] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          setResumeData(response.data);
          reset({
            title: response.data.title || '',
            summary: response.data.summary || ''
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

  const onSubmit = async (data: { title: string, summary: string }) => {
    try {
      setIsSaving(true);
      setError('');
      const response = await updateResumeAPI(resumeId, { 
        title: data.title, 
        summary: data.summary 
      });

      if (response.success) {
        router.push(`/resume/${resumeId}/education`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save summary.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetAtsScore = async () => {
    if (!resumeData) return;
    
    try {
      setIsScoring(true);
      setError('');
      // Send the entire resume data as a string for ATS scoring
      const contentString = JSON.stringify(resumeData);
      const response = await getAtsScoreAPI(contentString);
      if (response.success && response.data?.AtsScore) {
        setAtsScoreResult(response.data.AtsScore);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get ATS score.');
    } finally {
      setIsScoring(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-6">Summary & Title</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Resume Title</label>
          <input
            type="text"
            placeholder="e.g. Senior Frontend Developer"
            className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
            {...register('title')}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86]">Professional Summary</label>
            <div className="flex gap-3 items-center">
              <AiGenerateButton 
                onGenerate={async () => {
                  setPrevSummary(getValues('summary'));
                  const res = await generateSummaryAPI({
                    experienceLevel: resumeData?.experienceLevel || 'Beginner',
                    skills: resumeData?.skills || [],
                    jobTitle: resumeData?.jobTitle || 'Software Engineer'
                  });
                  if (res.success && res.data?.summary) return res.data.summary;
                  throw new Error('Failed to generate summary');
                }}
                onSuccess={(summary) => setValue('summary', summary, { shouldDirty: true, shouldValidate: true })}
                onRevert={() => setValue('summary', prevSummary, { shouldDirty: true, shouldValidate: true })}
                onError={setError}
              />
              <AiImproveButton 
                currentContent={watch('summary')}
                onImprove={(improved) => setValue('summary', improved, { shouldDirty: true, shouldValidate: true })}
                onError={setError}
              />
            </div>
          </div>
          <textarea
            rows={6}
            placeholder="A brief overview of your professional background..."
            className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
            {...register('summary')}
          ></textarea>
        </div>

        {/* ATS Score Section */}
        <div className="bg-white/50 dark:bg-[#3E271D]/50 p-4 border border-[#DF894A]/30 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#4A2E1B] dark:text-[#ECBA86]">ATS Optimization Score</h3>
              <p className="text-xs text-[#4A2E1B]/70 dark:text-[#ECBA86]/70">Analyze your entire resume against ATS standards.</p>
            </div>
            <button
              type="button"
              onClick={handleGetAtsScore}
              disabled={isScoring}
              className="py-1.5 px-4 text-xs rounded-md text-[#FFF9F2] bg-[#4A2E1B] hover:bg-[#DF894A] transition-colors disabled:opacity-50"
            >
              {isScoring ? 'Analyzing...' : 'Get Score'}
            </button>
          </div>
          {atsScoreResult && (
            <div className="mt-4 p-3 bg-white dark:bg-[#2A1C14] border border-[#DF894A]/20 rounded-md text-sm text-[#4A2E1B] dark:text-[#ECBA86] whitespace-pre-wrap">
              {atsScoreResult}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-[#DF894A]/20">
          <button
            type="button"
            onClick={() => router.push(`/resume/${resumeId}/personal-info`)}
            className="py-2 px-6 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] font-semibold transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Next: Education'}
          </button>
        </div>
      </form>
    </div>
  );
}
