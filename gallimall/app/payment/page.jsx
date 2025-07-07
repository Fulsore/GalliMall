import React, { Suspense } from 'react';
import PaymentClient from './PaymentClient';

const PaymentPage = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading payment info...</div>}>
      <PaymentClient />
    </Suspense>
  );
};

export default PaymentPage;

export const dynamic = 'force-dynamic';
