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


import axios from 'axios';

const Navbar = () => {

  const user = useSelector((state) => state.auth.user);
const token = useSelector((state) => state.auth.token);

  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useSelector((state) => state.location.current);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
}, []);

  
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
      setIsLoggedIn(false);
      setDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
   <nav className="bg-white shadow-md sticky top-0 z-50">
<div className="container md:max-w-full sm:mid-w-[780px] mx-auto flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
    {/* Left: Logo + Location */}
    <div className="flex items-center justify-between w-full md:w-auto gap-4">
      {/* Logo */}
      <Link href="/RoleDash/Customer" className="flex items-center gap-2">
        <img src="/Galli Mall Logo.png" alt="Galli Mall" className="w-10 h-10 rounded-full object-cover" />
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Galli Mall</span>
      </Link>

      {/* Location Button */}
      <div className="relative flex items-center">
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1 text-sm sm:text-base text-gray-600 hover:text-blue-600"
        >
          <CiLocationOn className="text-red-600 text-xl" />
          {location?.name
            ? location.name.split(',').slice(0, 2).join(', ')
            : 'Set Location'}
        </button>
        {isLocationModalOpen && <LocationModal onClose={() => setIsLocationModalOpen(false)} />}
      </div>
    </div>

    {/* Center: Search Bar */}
    <div className="w-full md:flex-1 md:px-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products or shops"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <i className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500">
          <IoSearchOutline />
        </i>
      </div>
    </div>

    {/* Right: Desktop Action Buttons */}
    <div className="hidden md:flex items-center gap-4">
     {token ? (
  <span className="px-4 py-2 text-gray-800 font-semibold">
    👋 {user?.name || 'User'}
  </span>
) : (
  <button
    onClick={handleRedirect}
    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2 text-sm sm:text-base"
  >
    <IoLogInOutline />
    Login
  </button>
)}


      <a href="/account">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition text-sm sm:text-base">
          <MdManageAccounts className="text-2xl" />
          <span className="font-medium">My Account</span>
        </button>
      </a>

      <a href="/cart">
        <IoCartOutline className="text-2xl text-gray-700" />
      </a>
    </div>
  </div>

  {/* Bottom Sticky Mobile Menu */}
  <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-inner border-t border-gray-200 z-50">
    <div className="flex justify-around items-center py-2">
      <button onClick={handleRedirect} className="flex flex-col items-center text-xs text-gray-700">
        <IoLogInOutline className="text-xl mb-1" />
        {isLoggedIn ? 'Login' : 'Register'}
      </button>

      <a href="/account" className="flex flex-col items-center text-xs text-gray-700">
        <MdManageAccounts className="text-xl mb-1" />
        Account
      </a>

      <a href="/cart" className="flex flex-col items-center text-xs text-gray-700">
        <IoCartOutline className="text-xl mb-1" />
        Cart
      </a>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
