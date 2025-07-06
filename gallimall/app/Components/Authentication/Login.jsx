'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Redux/Slice/authSlice';
import { useRouter } from 'next/navigation';

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        const userType = result.payload?.user?.user_type || result.payload?.user_type || 'customer';
        router.push(userType === 'vendor' ? '/RoleDash/Vendor' : '/RoleDash/Customer');
      } else {
        setErrorMessage('❌ Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('⚠️ Something went wrong. Please try again later.');
    }
  };

  const handleGoogleLogin = () => {
    alert('Google login is not yet implemented.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif">Welcome Back 👋</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-amber-400 hover:bg-amber-500 transition duration-300"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 bg-white hover:bg-gray-50 transition duration-300"
          >
            <img src="/images/GoogleG.png" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <a href="/authentication/register" className="font-semibold text-amber-500 underline hover:text-amber-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
