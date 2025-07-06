'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../Redux/Slice/locationSlice';
import { updateCustomerProfile } from '../../Redux/Slice/customerSlice';
import { fetchNearestShopId } from '../../Redux/Slice/shopSlice';
import { useRouter } from 'next/navigation';

const LocationModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [manualLocation, setManualLocation] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
const user = useSelector((state) => state.customer?.customer);


  const handleRedirectToNearestShop = async (lat, lon, name) => {
    dispatch(setLocation({ lat, lon, name }));

    if (user) {
      dispatch(updateCustomerProfile({
        name: user.user?.name || '',
        email: user.user?.email || '',
        phone: user.phone || '',
        address: name,
        latitude: lat,
        longitude: lon,
      }));
    }

    try {
      const result = await dispatch(fetchNearestShopId({ lat, lon }));
      if (result.payload) {
        router.push(`/RoleDash/Customer/shop?shopId=${result.payload}`);
        onClose();
      } else {
        alert('No nearby shop found.');
      }
    } catch (err) {
      console.error("Nearest shop fetch failed", err);
      alert("Unable to fetch nearest shop.");
    }
  };

  const handleManualSearch = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${manualLocation}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const loc = data[0];
        const address = loc.address;

        const house = address.house_number || '';
        const road = address.road || '';
        const area = address.suburb || address.neighbourhood || address.village || address.county || '';
        const city = address.city || address.town || address.village || address.state || '';
        const pincode = address.postcode || '';

        const name = [house, road, area, city, pincode].filter(Boolean).join(', ');

        setSearchedLocation(name);
        await handleRedirectToNearestShop(loc.lat, loc.lon, name);
      } else {
        alert('Location not found. Please refine your search.');
      }
    } catch (err) {
      console.error('Manual search failed:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const address = data.address;

          const house = address.house_number || '';
          const road = address.road || '';
          const area = address.suburb || address.neighbourhood || address.village || address.county || '';
          const city = address.city || address.town || address.village || address.state || '';
          const pincode = address.postcode || '';

          const name = [house, road, area, city, pincode].filter(Boolean).join(', ');

          setSearchedLocation(name);
          await handleRedirectToNearestShop(latitude, longitude, name);
        } catch (error) {
          console.error('Error fetching address:', error);
          alert('Failed to get your location address.');
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        if (err.code === 1) {
          alert('Permission denied. Please allow location access.');
        } else {
          alert('Unable to retrieve your location.');
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Select Your Location</h2>

        <input
          type="text"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
          placeholder="Enter house no, area, city..."
        />

        <button
          onClick={handleManualSearch}
          className="w-full bg-blue-500 text-white py-2 rounded mb-3"
        >
          Search Location
        </button>

        <button
          onClick={getCurrentLocation}
          className="w-full bg-green-500 text-white py-2 rounded mb-3"
        >
          Use My Current Location
        </button>

        {searchedLocation && (
          <p className="text-sm text-gray-600 mb-2">Selected: {searchedLocation}</p>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
