'use client';
import React from 'react';
import AddToCartButton from '../Components/AddToCartButton';

const CartTestPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧪 Cart Test Page</h1>
      <AddToCartButton productId={1} quantity={1} />
    </div>
  );
};

export default CartTestPage;
