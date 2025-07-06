'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateShop } from '../../../Redux/Slice/shopSlice';
import axios from 'axios';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VendorEditPage() {
  const dispatch = useDispatch();
  const { shop, loading, success, error } = useSelector((state) => state.shop);
  const [formData, setFormData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const shopRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (shopRes.data.results && shopRes.data.results.length > 0) {
          setFormData(shopRes.data.results[0]);
        }

        const catRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/`);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, shop_image: file }));
    }
  };

  const handleUpdate = () => {
    const data = new FormData();
    for (const key in formData) {
      if (
        (key === 'qr_code_image' || key === 'shop_image') &&
        typeof formData[key] === 'string'
      ) {
        continue;
      }
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }
    dispatch(updateShop({ shopId: formData.id, formData: data }));
  };

  if (fetching || !formData) {
    return (
      <div className="text-center p-10 text-gray-500 flex items-center justify-center gap-2">
        <Loader2 className="animate-spin h-5 w-5" />
        Loading shop details...
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto mt-10 bg-white p-6 sm:p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
        🛠️ Edit Your Store Info
      </h2>

      <div className="space-y-5 text-sm sm:text-base">
        {[
          'shop_name',
          'shop_description',
          'shop_address',
          'shop_phone_number',
          'shop_email',
          'shop_opening_hours',
          'pin_code',
          'latitude',
          'longitude',
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/_/g, ' ').toUpperCase()}
            value={formData[field] || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ))}

        <select
          name="shop_category"
          value={formData.shop_category || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Select Shop Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              ID-{cat.id} — {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition-all"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Updating...
            </div>
          ) : (
            'Update Store'
          )}
        </button>

        {error && (
          <div className="text-red-600 text-sm bg-red-100 border border-red-300 p-2 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm bg-green-100 border border-green-300 p-2 rounded-md flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Shop updated successfully!
          </div>
        )}
      </div>
    </section>
  );
}
