'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use } from 'react';

export default function ResumeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ resumeId: string }>;
}) {
  const pathname = usePathname();
  const { resumeId } = use(params);

  const steps = [
    { name: 'Personal Info', path: `/resume/${resumeId}/personal-info` },
    { name: 'Summary', path: `/resume/${resumeId}/summary` },
    { name: 'Education', path: `/resume/${resumeId}/education` },
    { name: 'Experience', path: `/resume/${resumeId}/experience` },
    { name: 'Projects', path: `/resume/${resumeId}/projects` },
    { name: 'Skills', path: `/resume/${resumeId}/skills` },
    { name: 'Preview', path: `/resume/${resumeId}/preview` },
  ];

  return (
    <div className="min-h-screen bg-[#ECBA86] dark:bg-[#3E271D] transition-colors print:bg-white print:dark:bg-white print:min-h-0">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 print:p-0 print:max-w-none print:w-full print:mx-0">
        <div className="flex flex-col md:flex-row gap-8 print:block print:gap-0">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0 print:hidden">
            <div className="bg-[#FFF9F2] dark:bg-[#2A1C14] rounded-xl shadow-xl p-4 border border-[#DF894A]/20 dark:border-[#DF894A]/40 sticky top-10">
              <h3 className="text-lg font-extrabold text-[#4A2E1B] dark:text-[#ECBA86] mb-4 px-3">
                Resume Builder
              </h3>
              <ul className="space-y-2">
                {steps.map((step) => {
                  const isActive = pathname.includes(step.path);
                  return (
                    <li key={step.name}>
                      <Link
                        href={step.path}
                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#DF894A] text-[#FFF9F2] shadow-sm'
                            : 'text-[#4A2E1B] hover:bg-[#DF894A]/10 dark:text-[#ECBA86] dark:hover:bg-[#DF894A]/20'
                        }`}
                      >
                        {step.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 px-3">
                <Link
                  href="/resume"
                  className="text-xs font-medium text-[#4A2E1B]/70 hover:text-[#DF894A] dark:text-[#ECBA86]/70 dark:hover:text-[#DF894A]"
                >
                  &larr; Back to Dashboard
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 print:w-full">
            <div className="bg-[#FFF9F2] dark:bg-[#2A1C14] rounded-xl shadow-xl p-6 sm:p-8 border border-[#DF894A]/20 dark:border-[#DF894A]/40 print:bg-white print:dark:bg-white print:shadow-none print:border-none print:p-0 print:rounded-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
