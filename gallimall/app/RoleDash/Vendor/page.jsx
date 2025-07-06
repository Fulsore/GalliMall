'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TruckIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ClipboardDocumentCheckIcon,
  BuildingStorefrontIcon,
  RectangleGroupIcon,
  BanknotesIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VendorDashboard() {
  const [storeOpen, setStoreOpen] = useState(true);

  const [overview, setOverview] = useState({
    todaysOrders: 0,
    revenue: 0.0,
    pendingDeliveries: 0,
  });

  const toggleStoreStatus = () => setStoreOpen(!storeOpen);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found');
        return;
      }

      const [ordersRes, revenueRes] = await Promise.all([
        fetch(`${API_BASE_URL}/vendor/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/vendor/revenue/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!ordersRes.ok || !revenueRes.ok) {
        console.error('Fetch failed:', ordersRes.status, revenueRes.status);
        return;
      }

      const ordersData = await ordersRes.json();
      const revenueData = await revenueRes.json();

      // console.log('🧾 ordersData:', ordersData);
      // console.log('💰 revenueData:', revenueData);

      const today = new Date().toISOString().split('T')[0];

      const todaysOrders = ordersData.filter(order => {
        const orderDate = order.timestamp?.split('T')[0];
        return orderDate === today;
      });

      // Since no status field, skip filtering for pending
      setOverview({
        todaysOrders: ordersData.length,
        revenue: revenueData?.total_revenue || 0,
        pendingDeliveries: 0, // or use status logic if added later
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  fetchDashboardData();
}, []);



  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
        <div className="text-2xl font-extrabold text-indigo-700 mb-8 flex items-center space-x-2">
          <HomeIcon className="h-6 w-6" />
          <span>Vendor Panel</span>
        </div>
        <nav className="flex flex-col space-y-5 text-gray-700">
          <Link href="/RoleDash/Vendor/" className="flex items-center space-x-3 hover:text-indigo-700">
            <RectangleGroupIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/RoleDash/Vendor/vendor_order" className="flex items-center space-x-3 hover:text-indigo-700">
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link href="/RoleDash/Vendor/vendor_revenue/" className="flex items-center space-x-3 hover:text-indigo-700">
            <BanknotesIcon className="h-5 w-5" />
            <span>Payments</span>
          </Link>
          <Link href="/logout" className="flex items-center space-x-3 text-red-600 hover:text-red-800">
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900">Vendor Dashboard</h1>

        {/* Overview Cards */}
        <section className="grid gap-8 grid-cols-1 md:grid-cols-3 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-6">
            <ShoppingCartIcon className="h-12 w-12 text-indigo-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Today's Orders</h2>
              <p className="mt-1 text-3xl font-bold text-gray-900">{overview.todaysOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-6">
            <CurrencyDollarIcon className="h-12 w-12 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
              <p className="mt-1 text-3xl font-bold text-gray-900">₹{overview.revenue.toFixed(2)}</p>
            </div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-6">
            <TruckIcon className="h-12 w-12 text-yellow-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Pending Deliveries</h2>
              <p className="mt-1 text-3xl font-bold text-gray-900">{overview.pendingDeliveries}</p>
            </div>
          </div> */}
        </section>

        {/* Store Status & Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Store Status */}
          <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">Store Status</h2>
              <p className="text-gray-600 text-sm">
                Your store is currently{' '}
                <span className={`font-semibold ${storeOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {storeOpen ? 'Open' : 'Closed'}
                </span>
              </p>
            </div>

            <button
              onClick={toggleStoreStatus}
              className={`relative inline-flex items-center h-8 rounded-full w-16 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                storeOpen ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                  storeOpen ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-3">
              <Cog6ToothIcon className="h-6 w-6 text-indigo-600" />
              <span>Quick Links</span>
            </h2>

            <nav className="flex flex-col space-y-4">
              <Link
                href="/RoleDash/Vendor/AllProducts"
                className="flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Add Product</span>
              </Link>

              <Link
                href="/RoleDash/Vendor/vendor_order/"
                className="flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
                <span>View Orders</span>
              </Link>

              <Link
                href="/RoleDash/Vendor/vendor_edit"
                className="flex items-center justify-center space-x-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
              >
                <BuildingStorefrontIcon className="h-5 w-5" />
                <span>Edit Store Info</span>
              </Link>
            </nav>
          </div>
        </section>

        {/* Create Digital Store Button */}
        <div className="flex justify-center mb-16">
          <Link
            href="/RoleDash/Vendor/DigitalStore"
            className="flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
            <span>Create Digital Store</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
