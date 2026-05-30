// ✅ Products.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../Redux/Slice/productSlice';
import { addToCart } from '../Redux/Slice/cartSlice';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Products = ({ categoryId = null, subcategoryId = null }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, status, error } = useSelector((state) => state.product);
  const token = useSelector((state) => state.auth.token);
  const cart_code = useSelector((state) => state.cart.cart_code);

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (subcategoryId) params.subcategoryId = subcategoryId;
    dispatch(fetchProduct(params));
  }, [dispatch, categoryId, subcategoryId]);

  const safeProducts = Array.isArray(products) ? products : [];

  const handleAddAndRedirect = async (product) => {
    await dispatch(addToCart({ productId: product.id, quantity: 1, token, cart_code }));
    setQuantities((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const increment = (productId) => {
    setQuantities((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    dispatch(addToCart({ productId, quantity: 1, token, cart_code }));
  };

  const decrement = (productId) => {
    const current = quantities[productId] || 0;
    const newQty = current - 1;

    if (newQty <= 0) {
      const updated = { ...quantities };
      delete updated[productId];
      setQuantities(updated);
    } else {
      setQuantities((prev) => ({ ...prev, [productId]: newQty }));
    }

    dispatch(addToCart({ productId, quantity: -1, token, cart_code }));
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  const baseTotal = safeProducts.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    const base = parseFloat(item.price || 0);
    return sum + qty * base;
  }, 0);

  const convenienceFee = totalItems > 0 ? 10 : 0;
  const totalPrice = baseTotal + convenienceFee;

  const handleViewCart = () => {
    const selectedItems = safeProducts.filter((p) => quantities[p.id]);
    localStorage.setItem('cartItems', JSON.stringify(selectedItems));
    localStorage.setItem('cartQuantities', JSON.stringify(quantities));
    localStorage.setItem('cartTotal', JSON.stringify(totalPrice));
    router.push('/cart');
  };

const getSafeImage = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith('http')) return url;
  if (url.startsWith('image/upload')) return `https://res.cloudinary.com/gallimall/${url}`;
  return `https://res.cloudinary.com/gallimall/image/upload/${url}`;
};


  return (
    <section className="px-4 py-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🛍️ Products</h2>

      {status === 'loading' && (
        <div className="flex justify-center items-center h-40">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {status === 'failed' && <p className="text-center text-red-500">Error: {error}</p>}

      {status === 'succeeded' && safeProducts.length === 0 && (
        <p className="text-center text-gray-500">No products found.</p>
      )}

      {status === 'succeeded' && safeProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {safeProducts.map((product) => {
              const qty = quantities[product.id] || 0;
              const base = parseFloat(product.price || 0).toFixed(2);
              const total = (qty > 0 ? parseFloat(base) * qty : 0).toFixed(2);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 transition hover:shadow-md flex flex-col"
                >
                  <div
                    className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 cursor-pointer"
                    onClick={() => handleAddAndRedirect(product)}
                  >
                    <img
                      src={getSafeImage(product.image_url)}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-700">₹{base}</p>
                    <p className="text-sm font-semibold text-green-700">Total: ₹{total}</p>
                  </div>

                  <div className="mt-2">
                    {qty === 0 ? (
                      <button
                        onClick={() => handleAddAndRedirect(product)}
                        className="bg-blue-500 text-white text-xs sm:text-sm px-3 py-1 rounded hover:bg-blue-600 w-full"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between mt-1 space-x-2">
                        <button
                          onClick={() => decrement(product.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => increment(product.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalItems > 0 && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-4 shadow-md flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  {totalItems} item(s) | ₹{totalPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Includes ₹{convenienceFee} convenience fee</p>
              </div>
              <button
                onClick={handleViewCart}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
              >
                View Cart
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Products;
