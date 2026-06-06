'use client';

import { useState } from 'react';
import { improveContentAPI } from '@/apis/ai.api';

interface AiImproveButtonProps {
  currentContent: string;
  onImprove: (improvedContent: string) => void;
  onError: (errorMsg: string) => void;
}

export default function AiImproveButton({ currentContent, onImprove, onError }: AiImproveButtonProps) {
  const [isImproving, setIsImproving] = useState(false);

  const handleImprove = async () => {
    if (!currentContent || currentContent.trim() === '') {
      onError('Please write something first before improving.');
      return;
    }
    
    try {
      setIsImproving(true);
      onError('');
      const response = await improveContentAPI(currentContent);
      if (response.success && response.data?.improvedContent) {
        onImprove(response.data.improvedContent);
      }
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to improve content.');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleImprove}
      disabled={isImproving}
      className="text-xs flex items-center gap-1 font-semibold text-[#DF894A] hover:text-[#4A2E1B] transition-colors disabled:opacity-50"
    >
      {isImproving ? '✨ Improving...' : '✨ Improve with AI'}
    </button>
  );
}
