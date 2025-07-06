'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomerProfile,
  updateCustomerProfile,
} from '../Redux/Slice/customerSlice';
// import { findNearestShop } from '../utils/location'; // optional

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { customer, loading, success } = useSelector((state) => state.customerProfile);
  const { shops } = useSelector((state) => state.shop);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [nearestShop, setNearestShop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  

  // Fetch customer profile on mount
  useEffect(() => {
    dispatch(fetchCustomerProfile());
  }, [dispatch]);

  // Update formData when customer is fetched
  useEffect(() => {
    if (customer) {
      const updated = {
        name: customer.user?.name || '',
        email: customer.user?.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        latitude: customer.latitude || '',
        longitude: customer.longitude || '',
      };
      setFormData(updated);

      if (customer.latitude && customer.longitude && shops?.length) {
        const shop = findNearestShop(
          parseFloat(customer.latitude),
          parseFloat(customer.longitude),
          shops
        );
        setNearestShop(shop);
      }
    }
  }, [customer, shops]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setFeedback(null);
      const response = await dispatch(updateCustomerProfile(formData)).unwrap();
      setFeedback({ type: 'success', message: '✅ Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      const formatted = {};
      for (const key in err) {
        formatted[key] = Array.isArray(err[key]) ? err[key][0] : err[key];
      }
      setErrors(formatted);
      setFeedback({ type: 'error', message: '❌ Please fix the errors below.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">👤 My Profile</h2>

        {loading && <p className="text-center text-blue-600">Loading profile…</p>}
        {feedback && (
          <div className={`text-center mb-4 text-sm font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.message}
          </div>
        )}
        {nearestShop && (
          <p className="text-sm text-center text-purple-600 mb-2">
            🏪 Nearest Shop: <strong>{nearestShop.name}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded-lg cursor-not-allowed text-gray-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                name="latitude"
                step="any"
                value={formData.latitude}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                name="longitude"
                step="any"
                value={formData.longitude}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
                isEditing
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
