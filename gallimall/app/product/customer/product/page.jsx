'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Products = dynamic(() => import('../../../Components/Products'), { ssr: false });

export default function ProductPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const subcategoryId = searchParams.get('subcategoryId');

  return (
    <Products categoryId={categoryId} subcategoryId={subcategoryId} />
  );
}
