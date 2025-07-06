'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../Redux/Slice/authSlice';
import { useRouter } from 'next/navigation';

const RegisterForm = ({ userType = 'customer' }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const userData = {
      name,
      email,
      password,
      password2: confirmPassword,
      user_type: userType,
      ...(userType === 'vendor' && { shop_name: shopName }),
    };

    try {
      const result = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(result)) {
        setFeedback({ type: 'success', message: '✅ Registration successful! Redirecting...' });
        setTimeout(() => router.push('/authentication/login'), 2000);
      } else {
        const payload = result.payload || {};
        const formattedErrors = {};
        for (const key in payload) {
          formattedErrors[key] = Array.isArray(payload[key]) ? payload[key][0] : payload[key];
        }
        setErrors(formattedErrors);
        setFeedback({ type: 'error', message: '❌ Please fix the errors below and try again.' });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setFeedback({ type: 'error', message: '⚠️ Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 sm:p-10 transition-all duration-300">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          {userType === 'vendor' ? 'Vendor' : 'Customer'} Sign Up
        </h2>

        {feedback && (
          <div className={`text-sm text-center font-medium mb-6 rounded px-4 py-3 ${feedback.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {userType === 'vendor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Example Kirana Store"
                className={`w-full px-4 py-2 border ${errors.shop_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-400`}
                required
              />
              {errors.shop_name && <p className="text-xs text-red-500 mt-1">{errors.shop_name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-400`}
              required
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${userType === 'vendor' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            {userType === 'vendor' ? 'Register as Vendor' : 'Register as Customer'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <a
            href="/authentication/login"
            className={`font-semibold underline ${userType === 'vendor' ? 'text-indigo-600 hover:text-indigo-700' : 'text-amber-600 hover:text-amber-700'}`}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
