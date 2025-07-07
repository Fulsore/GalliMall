'use client';

import { Suspense, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Link from 'next/link';
import { addToCart } from '../Redux/Slice/cartSlice';
import SearchHandler from './SearchHandler'; // <- new component

const BASE_URL = 'http://127.0.0.1:8000/';
const FALLBACK_IMAGE = 'https://res.cloudinary.com/gallimall/image/upload/v1750186556/GalliMall_Images/wjh5jyt4fqc5lmh81qye.jpg';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const cart_code = useSelector((state) => state.cart.cart_code);

  const getImageUrl = (image) => {
    if (!image) return FALLBACK_IMAGE;
    if (image.startsWith('http')) return image;
    if (!image.startsWith('/')) {
      return `https://res.cloudinary.com/gallimall/image/upload/${image}`;
    }
    return `${BASE_URL}${image}`;
  };

  const updateCart = (product, newQty) => {
    setQuantities((prev) => ({ ...prev, [product.id]: newQty }));
    dispatch(addToCart({ productId: product.id, quantity: newQty, token, cart_code }));
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartQuantities = JSON.parse(localStorage.getItem('cartQuantities')) || {};
    const exists = cartItems.find((p) => p.id === product.id);
    const updatedItems = exists
      ? cartItems.map((p) => (p.id === product.id ? { ...product } : p))
      : [...cartItems, product];
    cartQuantities[product.id] = newQty;
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    localStorage.setItem('cartQuantities', JSON.stringify(cartQuantities));
  };

  const addProduct = (product) => updateCart(product, 1);
  const increment = (product) => updateCart(product, (quantities[product.id] || 0) + 1);
  const decrement = (product) => {
    const currentQty = quantities[product.id] || 0;
    const newQty = currentQty - 1;
    if (newQty <= 0) {
      const updated = { ...quantities };
      delete updated[product.id];
      setQuantities(updated);
    }
    updateCart(product, Math.max(0, newQty));
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const access = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const [productRes, shopRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/`, {
            headers: { Authorization: `Bearer ${access}` },
          }),
        ]);
        const allProducts = productRes.data.results || [];
        const allShops = Array.isArray(shopRes.data) ? shopRes.data : shopRes.data.results || [];
        const filteredProducts = allProducts.filter((p) =>
          p.name?.toLowerCase().includes(query.toLowerCase())
        );
        const filteredShops = allShops.filter((shop) =>
          shop.shop_name?.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filteredProducts);
        setShops(filteredShops);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <Suspense fallback={null}>
        <SearchHandler onQuery={setQuery} />
      </Suspense>

      <h2 className="text-2xl font-semibold mb-4">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {shops.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Shops</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/RoleDash/Customer/shop?shopId=${shop.id}`}
                    className="block border rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-200"
                  >
                    <img
                      src={getImageUrl(shop.shop_image)}
                      alt={shop.shop_name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900">{shop.shop_name}</h3>
                      <p className="text-gray-600 text-sm">{shop.shop_description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-2">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-xl shadow hover:shadow-lg transition-all duration-200 bg-white"
                  >
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      <p className="mt-2 text-green-600 font-semibold">₹{product.price}</p>
                      <div className="mt-3">
                        {quantities[product.id] > 0 ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => decrement(product)} className="px-2 py-1 bg-red-500 text-white rounded">
                              −
                            </button>
                            <span>{quantities[product.id]}</span>
                            <button onClick={() => increment(product)} className="px-2 py-1 bg-green-500 text-white rounded">
                              +
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addProduct(product)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-right">
                <Link
                  href="/cart"
                  className="inline-block bg-green-600 text-white px-5 py-3 rounded-full hover:bg-green-700"
                >
                  Proceed to Cart & Payment
                </Link>
              </div>
            </div>
          )}

          {products.length === 0 && shops.length === 0 && <p>No results found.</p>}
        </>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
