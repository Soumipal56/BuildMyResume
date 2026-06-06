'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createResumeAPI } from '@/apis/resume.api';

export default function ResumePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdResumeId, setCreatedResumeId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', jobTitle: '', experienceLevel: 'Fresher' });

    const handleCreateResume = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError('');
            const response = await createResumeAPI(formData);
            if (response.success && response.data) {
                setIsModalOpen(false);
                setCreatedResumeId(response.data._id);
                router.push(`/resume/${response.data._id}/personal-info`);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create resume. Make sure you are logged in.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ECBA86] dark:bg-[#3E271D] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-[#FFF9F2] dark:bg-[#2A1C14] p-8 rounded-xl shadow-xl border border-[#DF894A]/20 dark:border-[#DF894A]/40 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-[#4A2E1B] dark:text-[#ECBA86]">
                        Your Resumes
                    </h2>
                    <p className="mt-2 text-sm text-[#4A2E1B]/70 dark:text-[#ECBA86]/70">
                        Manage and create your professional resumes here.
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
                        {error}
                    </div>
                )}

                {createdResumeId ? (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md border border-green-200 dark:border-green-800">
                        <p className="font-semibold mb-2">Resume created successfully!</p>
                        <p className="text-xs break-all mb-4 opacity-80">ID: {createdResumeId}</p>
                        <button
                            onClick={() => router.push(`/resume/${createdResumeId}/personal-info`)}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] transition-all shadow-md"
                        >
                            Go to Editor
                        </button>
                    </div>
                ) : (
                    <div className="mt-8">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A2E1B] transition-all shadow-md hover:shadow-lg"
                        >
                            + Create New Resume
                        </button>
                    </div>
                )}
            </div>

            {/* Create Resume Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#FFF9F2] dark:bg-[#2A1C14] w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-[#DF894A]/30">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-[#4A2E1B] dark:text-[#ECBA86] mb-4">Create New Resume</h3>
                            
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCreateResume} className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Resume Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. My Software Engineer Resume"
                                        className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Target Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Senior Frontend Developer"
                                        className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4A2E1B] dark:text-[#ECBA86] mb-1">Experience Level</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-md border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A]"
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                                    >
                                        <option value="Fresher">Fresher (0-1 years)</option>
                                        <option value="Mid-Level">Mid-Level (2-5 years)</option>
                                        <option value="Experienced">Experienced (5+ years)</option>
                                    </select>
                                </div>
                                
                                <div className="flex gap-3 pt-4 mt-6 border-t border-[#DF894A]/20">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-2 px-4 rounded-md text-[#4A2E1B] bg-transparent border border-[#DF894A]/50 hover:bg-[#DF894A]/10 dark:text-[#ECBA86] font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-2 px-4 rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] font-semibold transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}