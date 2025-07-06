'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { logoutUser } from '../../Redux/Slice/authSlice';
import { setLocation } from '../../Redux/Slice/locationSlice';
import LocationModal from './LocationModel';

import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline, IoCartOutline, IoLogInOutline } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useSelector((state) => state.location.current);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.user_type || null;
  const isLoggedIn = !!user;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.log(error);
          dispatch(setLocation(null));
        }
      );
    }
  }, [dispatch]);

  const handleRedirect = () => {
    router.push('/onboard/register');
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 lg:px-8 gap-3">
        <div className="flex items-center justify-between md:justify-start gap-5 w-full md:w-auto">
          <Link href="/RoleDash/Customer" className="flex items-center gap-2">
            <img src="/Galli Mall Logo.png" alt="Galli Mall" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-lg lg:text-2xl font-bold text-gray-800">Galli Mall</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex gap-1 items-center text-gray-600 hover:text-blue-600"
            >
              <CiLocationOn className="text-red-600 text-xl" />
              {location?.name
                ? location.name.split(',').slice(0, 2).join(', ')
                : 'Set Location'}
            </button>
            {isLocationModalOpen && <LocationModal onClose={() => setIsLocationModalOpen(false)} />}
          </div>
        </div>

        {(userRole === 'customer' || userRole === 'vendor') && (
          <div className="w-full md:max-w-md relative mx-auto md:mx-4">
            <input
              type="text"
              placeholder="Search for products or shops"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
              <IoSearchOutline />
            </i>
          </div>
        )}

        <div className="hidden md:flex justify-end items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={handleRedirect}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
            >
              <IoLogInOutline />
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center gap-2"
            >
              Logout
            </button>
          )}

          {userRole === 'customer' && (
            <>
              <a href="/account">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition">
                  <MdManageAccounts className="text-2xl" />
                  <span className="font-medium">My Account</span>
                </button>
              </a>
              <a href="/cart">
                <IoCartOutline className="text-2xl text-gray-700" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Bottom Sticky Menu - Only for customer */}
      {userRole === 'customer' && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-inner border-t border-gray-200 z-50">
          <div className="flex justify-around items-center py-2">
            {!isLoggedIn ? (
              <button onClick={handleRedirect} className="flex flex-col items-center text-sm text-gray-700">
                <IoLogInOutline className="text-2xl mb-1" />
                Login
              </button>
            ) : (
              <button onClick={handleLogout} className="flex flex-col items-center text-sm text-red-500">
                <IoLogInOutline className="text-2xl mb-1" />
                Logout
              </button>
            )}
            <a href="/account" className="flex flex-col items-center text-sm text-gray-700">
              <MdManageAccounts className="text-2xl mb-1" />
              Account
            </a>
            <a href="/cart" className="flex flex-col items-center text-sm text-gray-700">
              <IoCartOutline className="text-2xl mb-1" />
              Cart
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
