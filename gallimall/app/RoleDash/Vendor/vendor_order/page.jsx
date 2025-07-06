'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, PackageX, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://res.cloudinary.com/gallimall/image/upload/${imagePath}`;
};

const VendorOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchVendorOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/vendor/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch vendor orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('❌ Error fetching vendor orders:', error.message);
      setErrorMsg('Unable to fetch your orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-700 text-center">
        🧾 Vendor Orders
      </h1>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading your orders...
        </div>
      )}

      {!loading && errorMsg && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-md flex gap-2 items-center text-sm mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!loading && !errorMsg && orders.length === 0 && (
        <div className="text-center text-gray-500 text-sm flex flex-col items-center gap-2">
          <PackageX className="h-8 w-8" />
          <p>No orders for your shop yet.</p>
        </div>
      )}

      {!loading &&
        !errorMsg &&
        orders.map((order) => {
          const formattedDate = new Date(order.created_at || order.timestamp).toLocaleString();
          const shop = order.shop || {};

          return (
            <div
              key={order.id}
              className="bg-white shadow-sm rounded-lg p-4 mb-6 border border-gray-200"
            >
              <div className="flex justify-between text-xs text-gray-500">
                <p>🆔 Order ID: {order.id}</p>
                <p>🕒 {formattedDate}</p>
              </div>

              <div className="mt-2 mb-4 p-3 bg-gray-50 rounded text-sm space-y-1">
                <p className="font-semibold text-green-700">🏪 {shop.shop_name}</p>
                {shop.shop_address && <p className="text-gray-600">📍 {shop.shop_address}</p>}
                {shop.shop_phone_number && (
                  <p className="text-gray-600">📞 {shop.shop_phone_number}</p>
                )}
                {shop.shop_email && <p className="text-gray-600">✉️ {shop.shop_email}</p>}
              </div>

              <div className="space-y-3">
                {order.items.map((item, i) => {
                  const product = item.product || {};
                  const imageUrl = product.image_url || getImageUrl(product.image);

                  return (
                    <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <img
                        src={imageUrl}
                        alt={product.name || 'Product'}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity} = ₹
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* <div className="mt-4 text-xs text-gray-600 space-y-1"> */}
                {/* <p>
                  💳 Payment ID:{' '}
                  <span className="text-gray-800 font-medium">
                    {order.payment_id || 'N/A'}
                  </span>
                </p> */}
                {/* <p className="break-words">🔏 Signature: {order.signature || 'N/A'}</p> */}
              {/* </div> */}
            </div>
          );
        })}
    </div>
  );
};

export default VendorOrderPage;
