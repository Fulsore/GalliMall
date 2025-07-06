'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createVendorProduct } from '../../../Redux/Slice/vendorProductSlice'
import axios from 'axios'

const VendorProductForm = () => {
  const dispatch = useDispatch()
  const shop = useSelector((state) => state.shop.shop)  // Get shop from redux store

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    units: '',
    stockcount: '',
    subcategory: '',
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [subcategories, setSubcategories] = useState([])

  // Fetch subcategories dynamically from backend
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

    const fetchSubcategories = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/subcategory/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSubcategories(res.data)
      } catch (error) {
        console.error('Failed to load subcategories:', error)
      }
    }

    if (token) {
      fetchSubcategories()
    }
  }, [])

  // Generate image preview
  useEffect(() => {
    if (formData.image) {
      const url = URL.createObjectURL(formData.image)
      setImagePreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setImagePreview(null)
    }
  }, [formData.image])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('brand', formData.brand)
    data.append('price', formData.price)
    data.append('units', formData.units)
    data.append('stockcount', formData.stockcount)
    data.append('subcategory', formData.subcategory)
    if (formData.image) data.append('image', formData.image)

    // Append default shop ID
    if (shop && shop.id) {
      data.append('shop', shop.id)
    }

    dispatch(createVendorProduct(data))

    // Optional: reset form
    setFormData({
      name: '',
      description: '',
      brand: '',
      price: '',
      units: '',
      stockcount: '',
      subcategory: '',
      image: null,
    })
    setImagePreview(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-8"
      encType="multipart/form-data"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Add New Product</h2>

      {/* Show Default Shop Name */}
      {shop && (
        <div className="mb-4 p-3 bg-indigo-100 text-indigo-700 rounded">
          Default Shop: <strong>{shop.name}</strong>
        </div>
      )}

      {/* Product Name */}
      <InputField
        name="name"
        value={formData.name}
        handleChange={handleChange}
        label="Product Name"
        required
      />

      {/* Brand and Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="brand" value={formData.brand} handleChange={handleChange} label="Brand" />
        <InputField name="units" value={formData.units} handleChange={handleChange} label="Units (e.g. kg, pcs)" />
      </div>

      {/* Price and Stock Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          name="price"
          value={formData.price}
          handleChange={handleChange}
          label="Price (₹)"
          type="number"
          min="0"
          step="0.01"
          required
        />
        <InputField
          name="stockcount"
          value={formData.stockcount}
          handleChange={handleChange}
          label="Stock Count"
          type="number"
          min="0"
          required
        />
      </div>

      {/* Subcategory Select */}
      <div className="relative z-0 w-full group">
        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          required
          className="block py-2.5 px-3 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 rounded-t-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        >
          <option value="" disabled>
            Select Subcategory
          </option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        <label
          htmlFor="subcategory"
          className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-3 pointer-events-none"
        >
          Subcategory
        </label>
      </div>

      {/* Description */}
      <div className="relative z-0 w-full group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder=" "
          className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none resize-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        />
        <label
          htmlFor="description"
          className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600"
        >
          Description
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">Product Image</label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700"
          required
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Preview"
            className="mt-4 h-40 w-auto rounded-lg object-contain border border-gray-300"
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 mt-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
      >
        Add Product
      </button>
    </form>
  )
}

// Reusable input field component
const InputField = ({ name, value, handleChange, label, ...rest }) => (
  <div className="relative z-0 w-full group">
    <input
      name={name}
      value={value}
      onChange={handleChange}
      placeholder=" "
      className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
      {...rest}
    />
    <label
      htmlFor={name}
      className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600"
    >
      {label}
    </label>
  </div>
)

export default VendorProductForm
