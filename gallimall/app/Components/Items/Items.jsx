"use client";

import React from 'react';
import Link from 'next/link';

const items = [
  { name: "Dairy", image: "/images/Dairy.jpg" },
  { name: "Grocery", image: "/images/Grosery.jpg" },
  { name: "Electronics", image: "/images/Electronic.jpg" },
  { name: "Mobile", image: "/images/Mobile.jpg" },
  { name: "Toys", image: "/images/Toy.jpg" },
  { name: "Beauty", image: "/images/Beauty.jpg" },
  { name: "Fashion", image: "/images/Fashion.jpg" },
  { name: "Food", image: "/images/Food.jpg" },
];

const Items = () => {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Items / Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <Link
            key={index}
             href="/authentication/register"
            className="group block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-32 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-lg font-semibold text-gray-700 group-hover:text-amber-600">{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Items;
