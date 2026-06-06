import axios from 'axios';
import { IResume } from '@/types/resume.types';

export const createResumeAPI = async (data?: { title: string, jobTitle: string, experienceLevel: string }) => {
    const response = await axios.post('/api/resume/create', data || {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const getResumeAPI = async (resumeId: string) => {
    const response = await axios.get(`/api/resume/${resumeId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const updateResumeAPI = async (resumeId: string, data: Partial<IResume>) => {
    const response = await axios.patch(`/api/resume/${resumeId}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
