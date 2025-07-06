'use client';

import { useDispatch, useSelector } from 'react-redux';
import { createShop } from '../../../Redux/Slice/shopSlice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import QRCode from 'react-qr-code';

export default function DigitalStorePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success, shop } = useSelector((state) => state.shop);

  const [formData, setFormData] = useState({
    shop_name: '',
    shop_description: '',
    shop_address: '',
    shop_phone_number: '',
    shop_email: '',
    shop_opening_hours: '',
    shop_category: '',
    pin_code: '',
    latitude: '',
    longitude: '',
    shop_image: null,
  });

  const [categories, setCategories] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/`)
      .then((res) => setCategories(res.data))
      .catch(() => setApiError("⚠️ Failed to fetch categories. Please try again later."));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return setLocationError('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const address = res.data?.address;
          if (address?.postcode) {
            setFormData((prev) => ({
              ...prev,
              pin_code: address.postcode,
              shop_address: res.data.display_name,
            }));
            setLocationError('');
          } else {
            setLocationError('Could not fetch postal code from location');
          }
        } catch (error) {
          setLocationError('Failed to get address details');
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCreateStoreClick = () => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }
    dispatch(createShop(data));
  };

  const qrUrl = shop?.id
    ? `http://192.168.186.214:3000/RoleDash/Customer/shop?shopId=${shop.id}`
    : '';

  const handleDownload = () => {
    const svg = document.querySelector('#qr-code > svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `shop-${shop.id}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <section className="max-w-2xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🚀 Create Your Digital Store</h2>

        {locationError && (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-400 p-3 mb-4 rounded-md">
            {locationError}
          </div>
        )}

        {apiError && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-3 mb-4 rounded-md">
            {apiError}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-3 mb-4 rounded-md">
            {typeof error === 'string' ? error : error.detail || JSON.stringify(error)}
          </div>
        )}

        {success && shop?.id && (
          <div className="bg-green-100 text-green-700 border border-green-400 p-3 mb-4 rounded-md">
            🎉 Store created successfully!
          </div>
        )}

        <div className="grid gap-4">
          {[
            { name: 'shop_name', placeholder: 'Shop Name' },
            { name: 'shop_description', placeholder: 'Shop Description', type: 'textarea' },
            { name: 'shop_address', placeholder: 'Shop Address' },
            { name: 'shop_phone_number', placeholder: 'Phone Number' },
            { name: 'shop_email', placeholder: 'Email', type: 'email' },
            { name: 'shop_opening_hours', placeholder: 'Opening Hours (e.g., 9AM - 9PM)' },
          ].map((field) =>
            field.type === 'textarea' ? (
              <textarea
                key={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
              />
            ) : (
              <input
                key={field.name}
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            )
          )}

          <select
            name="shop_category"
            value={formData.shop_category}
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

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="pin_code"
              placeholder="Pin Code"
              value={formData.pin_code}
              onChange={handleChange}
              className="flex-grow px-4 py-2 border rounded-md"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              📍 Get Location
            </button>
          </div>

          {['latitude', 'longitude'].map((coord) => (
            <input
              key={coord}
              type="number"
              step="any"
              name={coord}
              placeholder={coord.charAt(0).toUpperCase() + coord.slice(1)}
              value={formData[coord]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          ))}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shop_image: e.target.files[0] }))
            }
            className="w-full px-4 py-2 border rounded-md"
          />

          <button
            onClick={handleCreateStoreClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? '⏳ Creating...' : '✅ Create Store'}
          </button>
        </div>

        {success && shop?.id && (
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Your Shop QR Code</h3>
            <div id="qr-code" className="bg-white p-4 inline-block shadow rounded">
              <QRCode value={qrUrl} size={180} />
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700"
            >
              ⬇ Download QR Code
            </button>
            <p className="mt-2 text-sm text-gray-500 break-words">{qrUrl}</p>
          </div>
        )}
      </div>
    </section>
  );
}
