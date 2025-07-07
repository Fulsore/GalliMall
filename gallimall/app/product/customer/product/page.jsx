'use client';

import { useSearchParams } from 'next/navigation';
import Products from '../../../Components/Products'; // adjust path if different

const ProductPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const subcategoryId = searchParams.get('subcategoryId');

  return (
    <Products categoryId={categoryId} subcategoryId={subcategoryId} />
  );
};

export default ProductPage;
