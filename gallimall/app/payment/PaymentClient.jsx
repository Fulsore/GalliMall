'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, verifyPayment, resetOrderState } from '../Redux/Slice/orderSlice';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';

const PaymentClient = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState(null);

  const { order, paymentStatus, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    const id = searchParams.get('productId');
    setProductId(id);
  }, [searchParams]);

  useEffect(() => {
    if (productId) {
      dispatch(createOrder(productId));
    }

    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch, productId]);

  const handlePayment = () => {
    if (!order || !window.Razorpay) {
      alert('Order not ready or Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'Galli Mall',
      description: `Payment for ${order.product}`,
      order_id: order.id,
      handler: function (response) {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        dispatch(verifyPayment(paymentData));
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Customer Address',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>

      {loading && <p>Processing...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {paymentStatus && <p className="text-green-500">{paymentStatus.message}</p>}

      <button
        onClick={handlePayment}
        disabled={!order || loading}
        className={`mt-4 px-4 py-2 rounded text-white ${
          !order || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentClient;

// // 4280 9029 2105 3237
// 09 / 31
// 976
