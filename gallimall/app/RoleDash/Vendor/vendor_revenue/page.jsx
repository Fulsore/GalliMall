'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react'; // optional icons

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const VendorRevenuePage = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchRevenue = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/vendor/revenue/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch revenue summary');
      const data = await res.json();
      setRevenue(data);
    } catch (err) {
      console.error('❌ Revenue fetch error:', err.message);
      setErrorMsg('Unable to fetch your revenue summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const lastOrderDate = revenue?.last_order_time
    ? new Date(revenue.last_order_time).toLocaleString()
    : 'N/A';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-6 sm:p-8 shadow-md rounded-xl border">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 text-center mb-6">
          💰 Revenue Summary
        </h1>

        {loading && (
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin h-5 w-5" />
            <p>Loading your revenue data...</p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!loading && revenue && (
          <div className="space-y-4 text-gray-800 text-base sm:text-lg">
            <p>
              🏪 <span className="font-semibold">{revenue.shop_name}</span>
            </p>
            <p>
              🧾 <span className="font-semibold">{revenue.total_orders}</span> total orders
            </p>
            <p>
              📦 <span className="font-semibold">{revenue.total_items_sold}</span> items sold
            </p>
            <p>
              💸 Total Revenue:{' '}
              <span className="font-semibold text-green-800">₹{revenue.total_revenue}</span>
            </p>
            <p>
              ⏱️ Last Order:{' '}
              <span className="text-gray-600">{lastOrderDate}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorRevenuePage;
