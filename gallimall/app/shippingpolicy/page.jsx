'use client';

import React from 'react';

const PolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Galli Mall Policies</h1>

      {/* Shipping Policy */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">📦 Shipping Policy</h2>
        <p className="mb-3">
          At <strong>Galli Mall</strong>, we aim to provide fast and efficient delivery of all your orders from local vendors near you.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Delivery is usually completed within <strong>1–2 hours</strong> for local vendors.</li>
          <li>Shipping is handled directly by vendor-partners or delivery agents.</li>
          <li>Customers can track order status live via the app or dashboard.</li>
          <li>No shipping charges are applied for orders above ₹199. Below that, a small fee may apply.</li>
          <li>Availability of delivery is subject to your location and shop operation hours.</li>
        </ul>
      </section>

      {/* Cancellation & Refund Policy */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">🔁 Cancellation & Refund Policy</h2>
        <p className="mb-3">
          We value your satisfaction and ensure a transparent and easy cancellation & refund process:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Orders can be cancelled before they are packed by the vendor. Once packed/dispatched, cancellations may not be possible.</li>
          <li>If an item is unavailable or out of stock, the vendor may cancel and refund the amount automatically.</li>
          <li>Refunds for prepaid orders will be processed to your original payment method within 5–7 business days.</li>
          <li>For any damaged or wrong items delivered, please raise a complaint within 24 hours of delivery for resolution.</li>
          <li>For Razorpay payments, refund initiation will reflect within Razorpay's transaction timeline.</li>
        </ul>
        <p className="mt-4">
          For further assistance, please contact our support team at <a href="mailto:support@gallimall.in" className="text-blue-600 underline">support@gallimall.in</a>.
        </p>
      </section>
    </div>
  );
};

export default PolicyPage;
