'use client'; // ✅ This is the fix!

import { Suspense } from 'react';
import ShopPage from './ShopPage';

export default function ShopPageWrapper() {
  return (
    <Suspense fallback={<div className="p-4">Loading shop...</div>}>
      <ShopPage />
    </Suspense>
  );
}
