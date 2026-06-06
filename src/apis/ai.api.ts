import axios from 'axios';
import { GenerateSummaryBody, GenerateSkillsBody, GenerateProjectDescriptionBody, GenerateExperienceDescriptionBody, GenerateProjectTechStackBody } from '@/types/ai.types';

export const improveContentAPI = async (content: string) => {
    const response = await axios.post('/api/ai/improve-content', { content }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const getAtsScoreAPI = async (content: string) => {
    const response = await axios.post('/api/ai/ats-score', { content }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const generateSummaryAPI = async (body: GenerateSummaryBody) => {
    const response = await axios.post('/api/ai/generate-summary', body);
    return response.data;
};

export const generateSkillsAPI = async (body: GenerateSkillsBody) => {
    const response = await axios.post('/api/ai/generate-skills', body);
    return response.data;
};

export const generateProjectDescriptionAPI = async (body: GenerateProjectDescriptionBody) => {
    const response = await axios.post('/api/ai/generate-project-description', body);
    return response.data;
};

export const generateExperienceDescriptionAPI = async (body: GenerateExperienceDescriptionBody) => {
    const response = await axios.post('/api/ai/generate-experience-description', body);
    return response.data;
};

export const generateProjectTechStackAPI = async (body: GenerateProjectTechStackBody) => {
    const response = await axios.post('/api/ai/generate-project-tech-stack', body);
    return response.data;
};
