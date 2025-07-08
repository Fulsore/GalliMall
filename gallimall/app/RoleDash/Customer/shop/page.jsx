// ✅ This file should be in: app/RoleDash/Customer/shop/page.jsx

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ShopPage = dynamic(() => import('./ShopPage'), { ssr: false });

export default function ShopPageWrapper() {
  return (
    <Suspense fallback={<div className="p-4">Loading shop...</div>}>
      <ShopPage />
    </Suspense>
  );
}
