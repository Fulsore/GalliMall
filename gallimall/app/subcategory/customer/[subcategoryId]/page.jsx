  'use client';

  import React, { useEffect, useState } from 'react';
  import { useParams } from 'next/navigation';
  import axios from 'axios';
  import Link from 'next/link';
  import { LoaderCircle } from 'lucide-react';

  const SubcategoryDetailPage = () => {
    const { subcategoryId } = useParams();

    const [subcategory, setSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchSubcategoryDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch subcategory details
          const subcategoryRes = await axios.get(`http://127.0.0.1:8000/api/subcategory/${subcategoryId}/`);
          setSubcategory(subcategoryRes.data);

          // Fetch products under this subcategory
          const productsRes = await axios.get(`http://127.0.0.1:8000/api/subcategory/${subcategoryId}/products/`);
          setProducts(productsRes.data);
        } catch (err) {
          console.error(err);
          setError('Failed to load subcategory details');
        } finally {
          setLoading(false);
        }
      };

      if (subcategoryId) {
        fetchSubcategoryDetails();
      }
    }, [subcategoryId]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!subcategory) {
      return <div className="text-center mt-10">Subcategory not found.</div>;
    }

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex flex-col items-center text-center">
            {subcategory.image && (
              <img
                src={`http://127.0.0.1:8000${subcategory.image}`}
                alt={subcategory.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 mb-4"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{subcategory.name}</h1>
            <p className="text-gray-600">{subcategory.description}</p>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 && <p>No products available in this subcategory.</p>}
           {products.map((product) => (
  <Link
    key={product.id}
    href={`/product/${product.id}`}
    className="bg-white p-4 rounded shadow text-center hover:shadow-md transition duration-200 cursor-pointer block"
  >
    {product.image && (
      <img
        src={`http://127.0.0.1:8000${product.image}`}
        alt={product.name}
        className="w-24 h-24 object-cover mx-auto mb-2"
      />
    )}
    <h3 className="text-lg font-medium">{product.name}</h3>
    <p className="text-gray-600 text-sm">₹{product.price}</p>
  </Link>
))}



          </div>
        </div>
      </div>
    );
  };

  export default SubcategoryDetailPage;
