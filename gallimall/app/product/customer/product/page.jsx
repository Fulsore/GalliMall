'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const Products = dynamic(() => import('../../../Components/Products'), { ssr: false });

export default function ProductPage() {
  const searchParams = useSearchParams();
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);

  useEffect(() => {
    setCategoryId(searchParams.get('categoryId'));
    setSubcategoryId(searchParams.get('subcategoryId'));
  }, [searchParams]);

  return (
    <Products categoryId={categoryId} subcategoryId={subcategoryId} />
  );
}
