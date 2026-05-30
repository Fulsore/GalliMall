"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory } from '../../Redux/Slice/categorySlice';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image'; // at top

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories = [], status, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-40">
        <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-red-500 text-center">Failed to load categories: {error}</div>;
  }

const getImageUrl = (path) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, '') || '';
  if (!path) return "/placeholder.jpg";
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${BASE_URL}${path}`;
  if (path.startsWith('image/upload')) return `https://res.cloudinary.com/gallimall/${path}`;
  return `https://res.cloudinary.com/gallimall/image/upload/${path}`;
};


  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-10xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              href={`/Category/${category.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-md transition-all cursor-pointer p-4 flex flex-col items-center text-center group"
            >

<Image
  src={getImageUrl(category.icon)}
  alt={category.name}
  width={112}
  height={112}
  className="w-20 h-20 lg:w-28 lg:h-28 object-cover rounded-full mb-4 border-2 border-gray-200 group-hover:border-primary transition"
  priority // optional: if above the fold
/>

              <h2 className="text-lg font-semibold text-gray-700 group-hover:text-primary">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
