"use client";

import React from 'react'
import Link from 'next/link'

const categories = [
  { name: "Dairy", image: "/images/d_shop.jpg" },
  { name: "Grocery", image: "/images/g_shop.jpg" },
  { name: "Electronics", image: "/images/e_shop.jpg" },
  { name: "Mobile", image: "/images/m_shop.jpg" },
  { name: "Toys", image: "/images/t_shop.jpg" },
  { name: "Beauty", image: "/images/b_shop.jpg" },
  { name: "Fashion", image: "/images/fashion_shop.jpg" },
  { name: "Food", image: "/images/f_shop.jpg" },
];

const Shops = () => {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shops / Vendors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <Link
             href="/authentication/register"
            key={index}
            className="group block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-32 w-full overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-lg font-semibold text-gray-700 group-hover:text-amber-600">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shops;
