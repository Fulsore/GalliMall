'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle, Heart, HeartOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchShopDetails,
  fetchNearestShopId,
} from '../../../Redux/Slice/shopSlice';
import { addToCart } from '../../../Redux/Slice/cartSlice';
import { useFavourite } from '../../../hooks/useFavourite';
import { useSearchParams } from 'next/navigation';

const BASE_URL = 'http://127.0.0.1:8000/';
const FALLBACK_IMAGE =
  'https://res.cloudinary.com/gallimall/image/upload/v1750186556/GalliMall_Images/wjh5jyt4fqc5lmh81qye.jpg';

const getImageUrl = (image) => {
  if (!image) return FALLBACK_IMAGE;
  if (image.startsWith('http') && image.includes('res.cloudinary.com/gallimall')) return image;
  if (image.startsWith('http')) return image;
  if (!image.startsWith('/')) return `https://res.cloudinary.com/gallimall/image/upload/${image}`;
  return `${BASE_URL}${image}`;
};

// ✅ Wrapped searchParams logic in suspense-friendly component
const ShopSearchHandler = ({ onShopId }) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get('shopId');
    if (id) onShopId(id);
  }, [searchParams]);
  return null;
};

const FloatingCartBar = ({ quantities, products }) => {
  const router = useRouter();
  const selectedItems = products.filter((p) => quantities[p.id]);
  const totalItems = selectedItems.reduce((sum, item) => sum + quantities[item.id], 0);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * quantities[item.id],
    0
  );

  if (totalItems === 0) return null;

  const handleViewCart = () => {
    localStorage.setItem('cartItems', JSON.stringify(selectedItems));
    localStorage.setItem('cartQuantities', JSON.stringify(quantities));
    localStorage.setItem('cartTotal', JSON.stringify(totalPrice));
    router.push('/cart');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-4 shadow-md flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-700 font-medium">
          {totalItems} item(s) | ₹{totalPrice.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">Extra charges may apply</p>
      </div>
      <button
        onClick={handleViewCart}
        className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
      >
        View Cart
      </button>
    </div>
  );
};

const ShopPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [shopIdQuery, setShopIdQuery] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [isFavourite, setIsFavourite] = useState(false);
  const [favId, setFavId] = useState(null);

  const { shop, products, nearestShopId, loading, error } = useSelector((state) => state.shop);
  const token = useSelector((state) => state.auth.token);
  const cart_code = useSelector((state) => state.cart.cart_code);
  const { getShopFavourites, addShopToFavourite, removeShopFromFavourite } = useFavourite();

  useEffect(() => {
    const checkShopFavourite = async () => {
      if (shop?.id) {
        const favs = await getShopFavourites();
        const match = favs?.find((f) => f.shop?.id === shop.id);
        setIsFavourite(!!match);
        setFavId(match?.id || null);
      }
    };
    checkShopFavourite();
  }, [shop]);

  const toggleShopFavourite = async () => {
    if (!shop?.id) return;
    if (isFavourite && favId) {
      await removeShopFromFavourite(favId);
      setIsFavourite(false);
      setFavId(null);
    } else {
      const fav = await addShopToFavourite(shop);
      if (fav?.id) {
        setIsFavourite(true);
        setFavId(fav.id);
      }
    }
  };

  useEffect(() => {
    if (shopIdQuery) {
      dispatch(fetchShopDetails(shopIdQuery));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(fetchNearestShopId({ lat: latitude, lon: longitude }));
        },
        (err) => console.error('Geolocation Error:', err)
      );
    }
  }, [shopIdQuery, dispatch]);

  useEffect(() => {
    if (!shopIdQuery && nearestShopId) {
      dispatch(fetchShopDetails(nearestShopId));
      router.replace(`/RoleDash/Customer/shop?shopId=${nearestShopId}`);
    }
  }, [nearestShopId, shopIdQuery, dispatch, router]);

  const handleAddToCart = (product) => {
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    dispatch(addToCart({ productId: product.id, quantity: 1, token, cart_code }));
  };

  const increment = (productId) => {
    setQuantities((prev) => {
      const newQty = (prev[productId] || 0) + 1;
      dispatch(addToCart({ productId, quantity: 1, token, cart_code }));
      return { ...prev, [productId]: newQty };
    });
  };

  const decrement = (productId) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty - 1;
      dispatch(addToCart({ productId, quantity: -1, token, cart_code }));
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Loading shop details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        ❌ Error: {error}
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <ShopSearchHandler onShopId={setShopIdQuery} />
      </Suspense>
      <div className="p-6 max-w-6xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">{shop?.shop_name}</h1>
          <button onClick={toggleShopFavourite} className="text-red-600 hover:text-red-800">
            {isFavourite ? <Heart className="fill-current" /> : <HeartOff />}
          </button>
        </div>
        <p className="text-gray-700">{shop?.shop_description}</p>
        <p className="text-sm text-gray-500 mt-1">
          📍 {shop?.shop_address} | 📞 {shop?.shop_phone_number}
        </p>

        {shop?.shop_image && (
          <img
            src={getImageUrl(shop.shop_image)}
            alt={shop.shop_name}
            className="w-full h-48 object-cover rounded-lg mt-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        )}

        <h2 className="text-xl font-semibold mt-6 mb-2">🛒 Products</h2>
        {products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const quantity = quantities[product.id] || 0;
              const imageUrl = getImageUrl(product.image_url || product.image);
              return (
                <div
                  key={product.id}
                  className="border p-4 rounded-xl shadow hover:shadow-lg transition bg-white"
                >
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover mb-2 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="mt-1 text-sm text-gray-700">₹{parseFloat(product.price).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    * ₹{parseFloat(product.convenience_fee || 0).toFixed(2)} convenience fee may apply at checkout
                  </p>
                  <p className="text-sm font-semibold text-green-700">
                    Total: ₹{quantity > 0 ? (parseFloat(product.price || 0) * quantity).toFixed(2) : '0.00'}
                  </p>

                  <div className="mt-2">
                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decrement(product.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-lg"
                        >
                          −
                        </button>
                        <span className="font-semibold text-gray-800">{quantity}</span>
                        <button
                          onClick={() => increment(product.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-lg"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 ml-2">No products listed yet.</p>
        )}

        <FloatingCartBar quantities={quantities} products={products} />
      </div>
    </>
  );
};

export default ShopPage;
export const dynamic = 'force-dynamic';
