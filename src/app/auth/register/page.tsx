'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerAPI } from '@/apis/auth.api';
import { RegisterBody } from '@/types/user.types';
import Link from 'next/link';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterBody>();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: RegisterBody) => {
        try {
            setIsLoading(true);
            setError('');
            const response = await registerAPI(data);
            if (response.success) {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ECBA86] dark:bg-[#3E271D] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-[#FFF9F2] dark:bg-[#2A1C14] p-8 rounded-xl shadow-xl border border-[#DF894A]/20 dark:border-[#DF894A]/40">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4A2E1B] dark:text-[#ECBA86]">
                        Create your account
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
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] placeholder-[#4A2E1B]/50 dark:placeholder-[#ECBA86]/50 text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A] focus:border-[#DF894A] sm:text-sm transition-colors"
                                placeholder="Full Name"
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
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
                            <label htmlFor="mobile" className="sr-only">Mobile Number</label>
                            <input
                                id="mobile"
                                type="text"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] placeholder-[#4A2E1B]/50 dark:placeholder-[#ECBA86]/50 text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A] focus:border-[#DF894A] sm:text-sm transition-colors"
                                placeholder="Mobile Number"
                                {...register('mobile', { required: 'Mobile number is required' })}
                            />
                            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#DF894A]/50 bg-white dark:bg-[#3E271D] placeholder-[#4A2E1B]/50 dark:placeholder-[#ECBA86]/50 text-[#4A2E1B] dark:text-[#ECBA86] focus:outline-none focus:ring-2 focus:ring-[#DF894A] focus:border-[#DF894A] sm:text-sm transition-colors"
                                placeholder="Password"
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
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
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                    <div className="text-sm text-center">
                        <Link href="/auth/login" className="font-medium text-[#4A2E1B] hover:text-[#DF894A] dark:text-[#ECBA86] dark:hover:text-[#DF894A] transition-colors">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
