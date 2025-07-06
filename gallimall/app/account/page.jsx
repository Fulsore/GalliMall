'use client';

import React from 'react';
import Link from 'next/link';

const Account = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Orders */}
          <Card
            title="🧾 My Orders"
            description="Check your recent and past orders."
            href="/order"
            color="blue"
            label="View Orders"
          />

          {/* Profile Settings */}
          <Card
            title="⚙️ Profile Settings"
            description="Update your details and address."
            href="/profile"
            color="green"
            label="Edit Profile"
          />

          {/* Saved Stores */}
          <Card
            title="🏬 Saved Stores"
            description="Your favorite shops in one place."
            href="/favouriteShop"
            color="yellow"
            label="View Stores"
          />

          {/* Saved Products */}
          <Card
            title="❤️ Saved Products"
            description="Easily access your favorite items."
            href="/favourite"
            color="pink"
            label="View Products"
          />

          {/* Logout */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">🚪 Logout</h2>
            <p className="text-gray-600 mb-4">Sign out of your Galli Mall account.</p>
            <button
              className="text-red-600 font-semibold hover:underline"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              Logout →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// 🔁 Reusable Card Component
const Card = ({ title, description, href, color, label }) => (
  <div className={`bg-${color}-50 border border-${color}-100 rounded-xl p-6`}>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link href={href} className={`text-${color}-600 font-semibold hover:underline`}>
      {label} →
    </Link>
  </div>
);

export default Account;
