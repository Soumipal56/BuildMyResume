'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function ResumeOverviewPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-full mb-6">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold text-[#4A2E1B] dark:text-[#ECBA86] mb-4">
        Resume Successfully Built!
      </h2>
      <p className="text-[#4A2E1B]/80 dark:text-[#ECBA86]/80 mb-8 max-w-md mx-auto">
        Your resume has been saved. You can continue editing it using the sidebar, or return to your dashboard.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push(`/resume`)}
          className="py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] transition-colors font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
