'use client';

import { useState } from 'react';

interface AiGenerateButtonProps {
  onGenerate: () => Promise<string | string[]>;
  onSuccess: (generatedContent: any) => void;
  onRevert: () => void;
  onError: (errorMsg: string) => void;
}

export default function AiGenerateButton({ onGenerate, onSuccess, onRevert, onError }: AiGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      onError('');
      const result = await onGenerate();
      if (result) {
        setIsGenerated(true);
        onSuccess(result);
      }
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to generate content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevert = () => {
    setIsGenerated(false);
    onRevert();
  };

  if (isGenerated) {
    return (
      <button
        type="button"
        onClick={handleRevert}
        className="text-xs flex items-center gap-1 font-semibold text-red-500 hover:text-red-700 transition-colors"
        title="Revert to previous content"
      >
        ✕ Undo AI Generation
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="text-xs flex items-center gap-1 font-semibold text-[#DF894A] hover:text-[#4A2E1B] transition-colors disabled:opacity-50"
    >
      {isGenerating ? '✨ Generating...' : '✨ Generate with AI'}
    </button>
  );
}
