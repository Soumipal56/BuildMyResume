import axios from 'axios';
import { LoginBody, RegisterBody } from '@/types/user.types';

export const loginAPI = async (data: LoginBody) => {
    const response = await axios.post('/api/auth/login', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const registerAPI = async (data: RegisterBody) => {
    const response = await axios.post('/api/auth/register', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
