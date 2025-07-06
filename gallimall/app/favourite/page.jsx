'use client';

import React, { useEffect, useState } from 'react';
import { useFavourite } from '../hooks/useFavourite'; // Adjust the path based on your project
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoaderCircle, Trash } from 'lucide-react';

const FavoriteProductsPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getFavourites, removeFromFavourite } = useFavourite();
  const router = useRouter();

  const fetchFavourites = async () => {
    setLoading(true);
    const data = await getFavourites();
    console.log('Fetched favourites:', data); // Debugging log
    setFavourites(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemove = async (favId) => {
    await removeFromFavourite(favId);
    setFavourites((prev) => prev.filter((item) => item.id !== favId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        <LoaderCircle className="animate-spin w-6 h-6 mr-2" />
        Loading Favourites...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">❤️ My Favourite Products</h1>
      {favourites.length === 0 ? (
        <p className="text-gray-600">You haven't added any favourites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favourites.map((fav) => (
            <div
              key={fav.id}
              className="border rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <Image
                src={fav.product?.image || '/placeholder.png'}
                alt={fav.product?.name || 'Product'}
                width={300}
                height={200}
                className="rounded-xl object-cover w-full h-48"
              />
              <h2 className="text-lg font-semibold mt-3">{fav.product?.name}</h2>
              <p className="text-sm text-gray-600">{fav.product?.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-green-600">₹{fav.product?.price}</span>
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full"
                  title="Remove from favourites"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteProductsPage;
