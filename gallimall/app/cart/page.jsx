'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { verifyPayment } from '../Redux/Slice/orderSlice';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const qty = JSON.parse(localStorage.getItem('cartQuantities')) || {};
    setCartItems(items);
    setQuantities(qty);
  }, []);

  useEffect(() => {
    const syncLatestPrices = async () => {
      if (cartItems.length === 0) return;

      try {
        const productIds = cartItems.map((item) => item.id);
        const response = await axios.post(`${API_BASE_URL}/products/latest-prices/`, {
          product_ids: productIds,
        });

        const updatedItems = cartItems.map((item) => {
          const latest = response.data.find((p) => p.id === item.id);
          return latest
            ? { ...item, price: latest.price, convenience_fee: latest.convenience_fee }
            : item;
        });

        setCartItems(updatedItems);
      } catch (err) {
        console.warn('Failed to sync latest prices');
      }
    };

    syncLatestPrices();
  }, [cartItems.length]);

  useEffect(() => {
    if (cartItems.length === 0) return;

    const baseTotal = cartItems.reduce((acc, item) => {
      const qty = quantities[item.id] || 0;
      const price = parseFloat(item.price || 0);
      return acc + qty * price;
    }, 0);

    const fee = cartItems[0]?.convenience_fee
      ? parseFloat(cartItems[0].convenience_fee)
      : 0;

    const finalTotal = baseTotal + fee;

    setTotalPrice(finalTotal);
    setConvenienceFee(fee);

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartQuantities', JSON.stringify(quantities));
    localStorage.setItem('cartTotal', JSON.stringify(finalTotal));
  }, [quantities, cartItems]);

  const increment = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id) => {
    setQuantities((prev) => {
      const newQty = (prev[id] || 1) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, newQty };
    });
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[id];

    setCartItems(updatedItems);
    setQuantities(updatedQuantities);

    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    localStorage.setItem('cartQuantities', JSON.stringify(updatedQuantities));
  };

  const getImageUrl = (path) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `http://127.0.0.1:8000${path}`;
    if (path.startsWith('image/upload')) return `https://res.cloudinary.com/gallimall/${path}`;
    return `https://res.cloudinary.com/gallimall/image/upload/${path}`;
  };

  const syncLocalCartToBackend = async () => {
    const token = localStorage.getItem('access_token');
    for (const item of cartItems) {
      await axios.post(
        `${API_BASE_URL}/cart-items/`,
        {
          product: item.id,
          quantity: quantities[item.id],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const razor_payment = async () => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) return alert('Razorpay SDK failed to load');

  const token = localStorage.getItem('access_token');
  if (!token) return alert('Please login to continue');

  try {
    await syncLocalCartToBackend();

    const response = await axios.post(
      `${API_BASE_URL}/create_order/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const order = response.data;

    // ✅ FORCE backend amount and fee to update UI
    setConvenienceFee(order.convenience_fee);
setTotalPrice(order.amount);


    // ✅ DEBUG to compare backend vs frontend before payment popup
    console.log("Cart Total before Razorpay:", totalPrice);
    console.log("Backend Razorpay Amount:", order.amount);
    alert(`About to pay ₹${order.amount} - Confirm it's same as shown`);

    const options = {
      key: order.razorpay_key,
      amount: order.amount * 100,
      currency: 'INR',
      name: 'Galli Mall',
      description: 'Payment for items',
      order_id: order.order_id,
      handler: function (response) {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        dispatch(verifyPayment(paymentData));
      },
      prefill: {
        name: 'Ramu Bitla',
        email: 'Ramu@gmail.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Bharath Nagar Colony',
        cart_items: JSON.stringify(order.cart_items),
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error('🧨 Error creating order:', err.response?.data || err.message);
    setErrorMessage(
      '⚠️ We ran into an issue while creating your order. Please check your internet connection or try again in a few minutes.'
    );
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div>
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            href="/RoleDash/Customer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Browse - Shop/Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => {
            const qty = quantities[item.id] || 0;
            const price = parseFloat(item.price || 0);
            const total = (qty * price).toFixed(2);

            return (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                  unoptimized
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} × {qty} = ₹{total}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decrement(item.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">−</button>
                  <span className="text-lg font-semibold">{qty}</span>
                  <button onClick={() => increment(item.id)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="ml-4 text-red-600 hover:text-red-800 text-sm">
                  ❌ Remove
                </button>
              </div>
            );
          })}

          <div className="border-t pt-4 mt-6 text-right">
            <p className="text-sm text-gray-500">Convenience Fee: ₹{convenienceFee.toFixed(2)}</p>
            <p className="text-lg font-bold">Total: ₹{totalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500">*Taxes and delivery charges may apply.</p>
            <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition" onClick={razor_payment}>
              Pay ₹{totalPrice.toFixed(2)} Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
