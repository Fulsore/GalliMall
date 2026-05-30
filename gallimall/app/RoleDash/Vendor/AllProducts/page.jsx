'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function VendorChecklistProduct() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sameProducts, setSameProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [shops, setShops] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState({});
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/category/')
      .then(res => setCategories(res.data))
      .catch(() => setError("⚠️ Failed to load categories. Please try again later."));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://127.0.0.1:8000/api/category/${selectedCategory}/subcategories/`)
        .then(res => setSubcategories(res.data))
        .catch(() => setError("⚠️ Failed to load subcategories."));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      axios.get(`http://127.0.0.1:8000/api/subcategory/${selectedSubCategory}/products/`)
        .then(res => {
          setSameProducts(res.data);
          setError(null);
        })
        .catch(() => setError("⚠️ Could not fetch products. Please retry."));
      setCheckedProducts({});
    }
  }, [selectedSubCategory]);

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/shops/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const shopList = res.data?.results || res.data || [];
          setShops(shopList);
        })
        .catch(() => setError("⚠️ Failed to load shops. Please check your connection."));
    } else {
      setError("⚠️ You are not logged in. Please log in to continue.");
    }
  }, [token]);

  const handleCheck = (id, field, value) => {
    setCheckedProducts(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!token || !selectedShop) {
      setError("Please select a shop and ensure you're logged in.");
      return;
    }

    const selected = Object.entries(checkedProducts).filter(([_, val]) => val?.checked);

    if (selected.length === 0) {
      setError("No products selected to submit.");
      return;
    }

    try {
      for (const [id, data] of selected) {
        const product = sameProducts.find(p => p.id === parseInt(id));
        const formData = new FormData();
        formData.set('name', product.name);
        formData.set('brand', product.brand);
        formData.set('subcategory', selectedSubCategory);
        formData.set('price', data.customPrice || product.price);
        formData.set('description', product.description);
        formData.set('shop', selectedShop);
        formData.set('stockcount', data.stock || 0);

        const imageUrl = getImageUrl(product.image);
        const imageBlob = await fetch(imageUrl).then(res => res.blob());
        formData.set('image', imageBlob, product.image.split('/').pop());

        await axios.post(
          'http://127.0.0.1:8000/api/vendor/products/',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      setSuccessMsg("✅ Products added successfully!");
      setCheckedProducts({});
    } catch (err) {
      setError("❌ Something went wrong while submitting products. Please try again.");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `http://127.0.0.1:8000${path}`;
    if (path.startsWith('image/upload')) return `https://res.cloudinary.com/gallimall/${path}`;
    return `https://res.cloudinary.com/gallimall/image/upload/${path}`;
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🛍️ Vendor Product Checklist</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-semibold">Oops!</strong> <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-semibold">Success!</strong> <span>{successMsg}</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Shop Name</label>
        <select
          value={selectedShop}
          onChange={e => setSelectedShop(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select Shop</option>
          {shops.map(shop => (
            <option key={shop.id} value={shop.id}>
              {shop.shop_name || `Shop ${shop.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Subcategory</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {subcategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      {sameProducts.length > 0 && (
        <table className="table-auto w-full border mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Custom Price</th>
            </tr>
          </thead>
          <tbody>
            {sameProducts.map(product => (
              <tr key={product.id} className="text-center">
                <td className="border p-2">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(product.id, 'checked', e.target.checked)}
                    checked={checkedProducts[product.id]?.checked || false}
                  />
                </td>
                <td className="border p-2">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                  />
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">₹{product.price}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-16 border px-1 rounded"
                    placeholder="Qty"
                    value={checkedProducts[product.id]?.stock || ''}
                    onChange={(e) => handleCheck(product.id, 'stock', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-20 border px-1 rounded"
                    placeholder="Price"
                    value={checkedProducts[product.id]?.customPrice || ''}
                    onChange={(e) => handleCheck(product.id, 'customPrice', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {sameProducts.length > 0 && (
        <button type="submit" className="mt-4 w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition">
          ✅ Submit Selected Products
        </button>
      )}
    </form>
  );
}
