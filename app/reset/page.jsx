"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import { z } from 'zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[a-zA-Z]/, 'Password must contain a letter'),
  confirmPassword: z.string()
    .min(8, 'Confirm Password must be at least 8 characters long'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const token = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationResult = passwordSchema.safeParse({ newPassword, confirmPassword });
      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push('/login'); // Redirect to login after reset
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to reset password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl mt-10 text-slate-700 font-extrabold mb-6 text-center">🔑 Reset Password</h2>
        
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className={`w-full p-2 border ${newPassword ? 'border-green-500' : 'border-gray-300'} rounded-md transition-colors`}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={`w-full p-2 border ${confirmPassword ? 'border-green-500' : 'border-gray-300'} rounded-md transition-colors`}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className={`w-full py-2 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress size={24} color="inherit" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
