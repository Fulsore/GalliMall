'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const FavoriteShopPage = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/shops/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched favorite shops:', res.data);

        // Fix: Use `results` from paginated response
        if (Array.isArray(res.data.results)) {
          setShops(res.data.results);
        } else {
          setShops([]);
          console.error('Expected paginated array under `results`');
        }
      } catch (err) {
        console.error('Error fetching favorite shops:', err);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Favorite Shops</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {shops.length > 0 ? (
  shops.map((item) => (
    <Link
      key={item.id}
      href={`/RoleDash/Customer/shop?shopId=${item.shop.id}`}
      className="block border p-4 rounded shadow hover:shadow-lg"
    >
      <img
        src={item.shop.shop_image}
        alt={item.shop.shop_name}
        className="w-full h-32 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-semibold">{item.shop.shop_name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{item.shop.shop_description}</p>
    </Link>
  ))
) : (
  <p className="text-sm text-gray-500 col-span-full">No favorite shops found.</p>
)}

      </div>
    </div>
  );
};

export default FavoriteShopPage;
