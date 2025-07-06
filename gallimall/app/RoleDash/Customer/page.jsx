'use client';

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Hero from "../../Components/Hero/HeroSlider";
import Category from "../../Category/Customer/page";
import axios from "axios";
import Product from "../../product/customer/product/page";

export default function CustomerDashboard() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const backendBaseUrl = "http://127.0.0.1:8000";

  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingShops, setLoadingShops] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState('');

  const fetchPromotions = async () => {
    try {
      const res = await axios.get(`${backendBaseUrl}/api/promotions/`);
      setPromotions(res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch promotions", err);
      setPromotions([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/api/subcategory/`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setSuggestedProducts(data.slice(0, 3));
    } catch (err) {
      setError(err.message);
      setErrorType("products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${backendBaseUrl}/api/shops/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(response.data.results);
    } catch (err) {
      setError(err.message);
      setErrorType("shops");
    } finally {
      setLoadingShops(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
    fetchShops();
  }, []);

  const handleRedirect = (route) => {
    router.push(route);
  };

  const renderCarouselItems = (
    items,
    imageKey,
    nameKey,
    clickRouteKey,
    fallbackImage = "/images/b_shop.jpg"
  ) => {
    if (!Array.isArray(items)) return null;

    return (
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 px-1">
        {items.map((item) => {
          const imagePath = item[imageKey];
          const imageUrl = imagePath
            ? imagePath.startsWith("http")
              ? imagePath
              : `https://res.cloudinary.com/gallimall/${imagePath}`
            : fallbackImage;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() =>
                handleRedirect(
                  typeof clickRouteKey === "function"
                    ? clickRouteKey(item)
                    : item[clickRouteKey]
                )
              }
              className="min-w-[90px] sm:min-w-[100px] cursor-pointer flex flex-col items-center hover:shadow-md"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={imageUrl}
                  alt={item[nameKey] || "Item"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <p className="mt-2 text-sm text-gray-700 font-medium text-center w-full truncate">
                {item[nameKey]}
              </p>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f5] min-h-screen">
      <Hero />
      <div className="px-4 sm:px-6 md:px-10 py-6 space-y-10">
        <Category />

        {/* 🏪 Shops */}
        <section id="shops">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">🧭 All Shops</h2>
          {loadingShops ? (
            <p className="text-gray-500">Loading shops...</p>
          ) : errorType === "shops" ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
              <p className="font-semibold">⚠️ Unable to load shops.</p>
              <button
                onClick={() => {
                  setErrorType("");
                  setLoadingShops(true);
                  fetchShops();
                }}
                className="mt-2 text-sm text-blue-600 underline"
              >
                Retry
              </button>
            </div>
          ) : (
            renderCarouselItems(
              shops,
              "shop_image",
              "name",
              (item) => `/RoleDash/Customer/shop?shopId=${item.id}`
            )
          )}
        </section>

        {/* 🎁 Promotions */}
        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">⭐ Promotions</h2>
          {promotions.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-md">
              <p className="font-medium">No promotions available right now.</p>
            </div>
          ) : (
            renderCarouselItems(
              promotions,
              "image",
              "title",
              (item) => item.link || "#"
            )
          )}
        </section>

        {/* 🛍️ Products */}
        <section id="products">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">🛍️ Products</h2>
          {loadingProducts ? (
            <p className="text-gray-500">Loading products...</p>
          ) : errorType === "products" ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
              <p className="font-semibold">❌ Failed to fetch products.</p>
              <button
                onClick={() => {
                  setErrorType("");
                  setLoadingProducts(true);
                  fetchProducts();
                }}
                className="mt-2 text-sm text-blue-600 underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <Product />
          )}
        </section>
      </div>
    </main>
  );
}
