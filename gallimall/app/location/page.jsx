'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchNearestShopId } from '../Redux/Slice/shopSlice';
import { LoaderCircle, LocateFixed } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationBasedShopLoader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { nearestShopId } = useSelector((state) => state.shop);
  const [loading, setLoading] = useState(false);

  const handleShopClick = async () => {
    setLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const action = await dispatch(fetchNearestShopId({ lat: latitude, lon: longitude }));
          if (fetchNearestShopId.fulfilled.match(action)) {
            const nearestId = action.payload;
            router.push(`/RoleDash/Customer/shop?shopId=${nearestId}`);
          } else {
            alert(`Error: ${action.payload || 'Unable to find nearest shop.'}`);
          }
          setLoading(false);
        },
        (error) => {
          alert('Location access denied or unavailable.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      alert('Unexpected error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white shadow-md border rounded-2xl p-4 w-full sm:w-96 mx-auto cursor-pointer text-center transition"
      onClick={handleShopClick}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <LoaderCircle className="animate-spin h-8 w-8 text-blue-600" />
          <p className="mt-2 text-gray-600 text-sm">Finding nearest shop...</p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-40 overflow-hidden rounded-xl mb-2">
            <img
              src="/images/b_shop.jpg"
              alt="Shop Near You"
              className="w-full h-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <LocateFixed className="text-blue-600" />
            <p className="text-md font-medium text-gray-800">Tap to find a shop near you</p>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LocationBasedShopLoader;
