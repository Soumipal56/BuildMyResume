'use client';
import { use, useEffect, useState } from 'react';
import { getResumeAPI } from '@/apis/resume.api';
import { IResume } from '@/types/resume.types';

export default function ResumePreviewPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = use(params);
  const [resumeData, setResumeData] = useState<IResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResumeAPI(resumeId);
        if (response.success && response.data) {
          setResumeData(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load resume for preview.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  if (isLoading) {
    return <div className="text-center py-10 text-[#4A2E1B] dark:text-[#ECBA86]">Loading Preview...</div>;
  }

  if (error || !resumeData) {
    return (
      <div className="text-center py-10 text-red-600">
        {error || 'Resume not found.'}
      </div>
    );
  }

  const { personalInfo, summary, workExperience, projects, education, skills, certifications } = resumeData;

  const handleDownloadPdf = async () => {
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('resume-preview-content');
      const opt = {
        margin:       0,
        filename:     `${personalInfo?.fullname?.replace(/\s+/g, '_') || 'Resume'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF. Please try printing instead.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Toolbar - Hidden when printing */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-[#4A2E1B] dark:text-[#ECBA86]">Resume Preview</h2>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 py-2 px-6 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 py-2 px-6 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] transition-colors font-semibold shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* A4 Resume Container */}
      <div id="resume-preview-content" className="w-full max-w-4xl bg-white text-gray-900 p-8 sm:p-12 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 print:w-full border border-gray-200 print:border-none">
        
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
          <h1 className="text-4xl font-extrabold uppercase tracking-wider text-gray-900 mb-1">{personalInfo.fullname}</h1>
          <p className="text-xl text-gray-700 font-medium mb-3">{resumeData.jobTitle || 'Professional'}</p>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.mobile && <span>• {personalInfo.mobile}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedIn && (
              <span>• <a href={personalInfo.linkedIn} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a></span>
            )}
            {personalInfo.github && (
              <span>• <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">GitHub</a></span>
            )}
            {personalInfo.portfolio && (
              <span>• <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Portfolio</a></span>
            )}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-2 uppercase tracking-wide">Professional Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {workExperience && workExperience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wide">Work Experience</h3>
            <div className="space-y-4">
              {workExperience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-md font-bold text-gray-800">{exp.position} <span className="font-normal italic text-gray-600">at {exp.company}</span></h4>
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap ml-4">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''} - 
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wide">Projects</h3>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-md font-bold text-gray-800">
                      {proj.title}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 font-normal ml-2 hover:underline">(Live)</a>}
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 font-normal ml-2 hover:underline">(Source)</a>}
                    </h4>
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <p className="text-xs text-gray-600 font-medium mb-1 italic">
                      Tech Stack: {proj.techStack.join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wide">Education</h3>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <h4 className="text-md font-bold text-gray-800">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institute}</p>
                  </div>
                  <span className="text-sm text-gray-500 font-medium whitespace-nowrap ml-4">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric' }) : ''} - 
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric' }) : ' Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Certifications */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wide">Skills & Certifications</h3>
          
          {skills && skills.length > 0 && (
            <div className="mb-2">
              <span className="font-bold text-sm text-gray-800 mr-2">Technical Skills:</span>
              <span className="text-sm text-gray-700 leading-relaxed">{skills.join(', ')}</span>
            </div>
          )}
          
          {certifications && certifications.length > 0 && (
            <div>
              <span className="font-bold text-sm text-gray-800 mr-2">Certifications:</span>
              <span className="text-sm text-gray-700 leading-relaxed">{certifications.join(', ')}</span>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
