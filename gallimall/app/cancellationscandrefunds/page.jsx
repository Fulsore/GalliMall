'use client';

import React from 'react';

const CancellationAndRefund = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Cancellation & Refund Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Cancellation</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>You can cancel your order within a limited time window before the vendor starts preparing it.</li>
          <li>Once an order is packed or dispatched, it cannot be cancelled.</li>
          <li>To cancel an order, go to your order history and click “Cancel Order” (if the option is still available).</li>
          <li>Vendors also have the right to cancel the order if an item is unavailable or due to logistical issues.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Refund Policy</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>If you cancel a prepaid order, your refund will be processed within 5–7 business days.</li>
          <li>Refunds are credited back to the original payment method (Razorpay, UPI, or card).</li>
          <li>In case of failed delivery, damaged goods, or incorrect items, you can request a refund within 24 hours of delivery.</li>
          <li>Our support team will investigate the issue and confirm eligibility for refund or replacement.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Refund Timeline</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>UPI / Wallet: 2–3 business days</li>
          <li>Card Payments: 5–7 business days</li>
          <li>Netbanking: 5–7 business days</li>
          <li>Cash on Delivery: Not applicable for refund (only exchange or wallet credit if applicable)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p>
          If you have any concerns regarding cancellations or refunds, please reach out to our support team at{' '}
          <a href="mailto:support@gallimall.in" className="text-blue-600 underline">support@gallimall.in</a> or call +91-9392034144.
        </p>
      </section>
    </div>
  );
};

export default CancellationAndRefund;
