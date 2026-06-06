'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginAPI } from '@/apis/auth.api';
import { LoginBody } from '@/types/user.types';
import Link from 'next/link';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginBody>();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: LoginBody) => {
        try {
            setIsLoading(true);
            setError('');
            const response = await loginAPI(data);
            if (response.success) {
                router.push('/resume');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ECBA86] dark:bg-[#3E271D] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-[#FFF9F2] dark:bg-[#2A1C14] p-8 rounded-xl shadow-xl border border-[#DF894A]/20 dark:border-[#DF894A]/40">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4A2E1B] dark:text-[#ECBA86]">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] placeholder-[#4A2E1B]/50 dark:placeholder-[#ECBA86]/50 text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A] focus:border-[#DF894A] sm:text-sm transition-colors"
                                placeholder="Email address"
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] placeholder-[#4A2E1B]/50 dark:placeholder-[#ECBA86]/50 text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A] focus:border-[#DF894A] sm:text-sm transition-colors"
                                placeholder="Password"
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#FFF9F2] bg-[#DF894A] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A2E1B] disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    <div className="text-sm text-center">
                        <Link href="/auth/register" className="font-medium text-[#4A2E1B] hover:text-[#DF894A] dark:text-[#ECBA86] dark:hover:text-[#DF894A] transition-colors">
                            Don't have an account? Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
