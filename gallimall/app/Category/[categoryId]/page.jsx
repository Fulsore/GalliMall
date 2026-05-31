'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { LoaderCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/Slice/cartSlice';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMenu,
} from 'react-icons/ai';
import { useFavourite } from '../../hooks/useFavourite';
import FloatingCartBar from './floatingCartBar';

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const cart_code = useSelector((s) => s.cart.cart_code);

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [favorites, setFavorites] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { addToFavourite, getFavourites, removeFromFavourite } = useFavourite();
  const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://gallimall-backend.onrender.com";

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, subRes] = await Promise.all([
          axios.get(`${BASE_URL}/category/${categoryId}/`),
          axios.get(`${BASE_URL}/category/${categoryId}/subcategories/`),
        ]);
        setCategory(catRes.data);
        setSubcategories(subRes.data);
        if (subRes.data.length) setSelectedSubcategory(subRes.data[0]);
      } catch (err) {
        console.error(err);
        setError('Failed to load category info.');
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (!selectedSubcategory) return;
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subcategory/${selectedSubcategory.id}/products/`);
        const vendorProducts = res.data.filter((product) => product.shop != null);
        setProducts(vendorProducts);
      } catch {
        setProducts([]);
      }
    })();
  }, [selectedSubcategory]);

  const handleAddToCart = (product) => {
    setQuantities((q) => ({ ...q, [product.id]: 1 }));
    dispatch(addToCart({ productId: product.id, quantity: 1, token, cart_code }));
  };

  const increment = (id) => {
    setQuantities((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
    dispatch(addToCart({ productId: id, quantity: 1, token, cart_code }));
  };

  const decrement = (id) => {
    setQuantities((q) => {
      const newQty = (q[id] || 1) - 1;
      const updated = { ...q };
      newQty <= 0 ? delete updated[id] : (updated[id] = newQty);
      return updated;
    });
    dispatch(addToCart({ productId: id, quantity: -1, token, cart_code }));
  };

  const toggleFavorite = async (product) => {
    const isFav = favorites[product.id];
    try {
      if (isFav) {
        const favList = await getFavourites();
        const match = favList.find((f) => f.product?.id === product.id);
        if (match) await removeFromFavourite(match.id);
      } else {
        await addToFavourite(product);
      }
      setFavorites((f) => ({ ...f, [product.id]: !isFav }));
    } catch (err) {
      console.error('Fav error', err);
    }
  };

const getImageUrl = (path) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, '') || '';
  if (!path) return "/placeholder.jpg";
  if (path.startsWith('http') || path.startsWith('https')) return path;
  if (path.startsWith('/')) return `${BASE_URL}${path}`;
  if (path.startsWith('image/upload')) return `https://res.cloudinary.com/gallimall/${path}`;
  return `https://res.cloudinary.com/gallimall/image/upload/${path}`;
};


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="sm:hidden fixed top-0 inset-x-0 z-40 bg-white border-b p-3 flex items-center justify-between">
        <button onClick={() => setDrawerOpen(true)} className="text-2xl">
          <AiOutlineMenu />
        </button>
        <span className="text-base font-semibold">{selectedSubcategory?.name || 'Products'}</span>
      </div>

      {drawerOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="w-64 bg-white p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
            <ul className="space-y-3">
              {subcategories.map((s) => (
                <li
                  key={s.id}
                  onClick={() => {
                    setSelectedSubcategory(s);
                    setDrawerOpen(false);
                  }}
                  className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 ${selectedSubcategory?.id === s.id ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      <aside className="hidden sm:block sm:w-1/4 md:w-1/5 p-4 border-r bg-white">
        <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
        <ul className="space-y-3">
          {subcategories.map((s) => (
            <li
              key={s.id}
              onClick={() => setSelectedSubcategory(s)}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 ${selectedSubcategory?.id === s.id ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
            >
              {s.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 pt-16 sm:pt-6 pb-24 px-4 sm:px-6">
        <h1 className="hidden sm:block text-2xl font-bold mb-4">{selectedSubcategory?.name || 'Select a subcategory'}</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => {
              const qty = quantities[p.id] || 0;

              return (
                <div key={p.id} className="bg-white p-3 rounded-lg shadow hover:shadow-md transition relative">
                  <button onClick={() => toggleFavorite(p)} className="absolute right-3 top-3 text-xl text-red-500">
                    {favorites[p.id] ? <AiFillHeart /> : <AiOutlineHeart />}
                  </button>

                  <Image
                    src={getImageUrl(p.image)}
                    alt={p.name}
                    width={300}
                    height={150}
                    priority
                    className="w-full h-32 object-cover rounded mb-2"
                  />

                  <h3 className="text-sm font-semibold line-clamp-1" title={p.name}>{p.name}</h3>
                  <p className="text-gray-500 text-xs mb-2">₹{p.price}</p>

                  {qty === 0 ? (
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="bg-blue-500 w-full text-white text-xs py-1 rounded hover:bg-blue-600"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => decrement(p.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        –
                      </button>
                      <span className="font-semibold text-sm">{qty}</span>
                      <button
                        onClick={() => increment(p.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <FloatingCartBar
        quantities={quantities}
        products={products}
        className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      />
    </div>
  );
}