'use client';

import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const OrderSuccessPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const res = await fetch(`${API_BASE_URL}/orders/successful/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch successful orders');
      const data = await res.json();

      const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(sorted);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '/logo.png';
    if (path.startsWith('http')) return path;
    return `https://res.cloudinary.com/gallimall/image/upload/${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-lg text-gray-600">No successful orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        🛒 Your Successful Orders
      </h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map((order) => {
          const formattedDate = new Date(order.timestamp).toLocaleString();
          const orderTotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);

          return (
            <div key={order.id} className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">✅ Order #{order.id}</h2>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>

              {/* Shop Info */}
              {order.shop && (
                <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded-md">
                  <p className="font-medium text-green-700">Shop: {order.shop.shop_name}</p>
                  <p>{order.shop.shop_address}</p>
                  <p className="text-gray-600">📞 {order.shop.shop_phone_number}</p>
                </div>
              )}

              {/* Items */}
              <div className="mt-4 space-y-4">
                {order.items.map((item, index) => {
                  const product = item.product;
                  const imageUrl = product.image_url || getImageUrl(product.image);
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-4 border-t pt-3 text-right text-base font-semibold text-green-700">
                Total: ₹{orderTotal.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
