import axios from 'axios';

export const useFavourite = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getFavourites = async () => {
    if (!token) return [];
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/products/my_favourites/`, { headers });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Fetch product favourites failed', err);
      return [];
    }
  };

  const addToFavourite = async (product) => {
    if (!token || !product) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/products/`, {
        product_id: product.id,
      }, { headers });
      return res.data;
    } catch (err) {
      console.error('Add to product favourite failed', err);
      return null;
    }
  };

  const removeFromFavourite = async (favId) => {
    if (!token || !favId) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/products/${favId}/`, { headers });
    } catch (err) {
      console.error('Remove product favourite failed', err);
    }
  };

  // 🎯 SHOP FAVOURITE METHODS
  const getShopFavourites = async () => {
    if (!token) return [];
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/shops/`, { headers });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Fetch shop favourites failed', err);
      return [];
    }
  };

  const addShopToFavourite = async (shop) => {
    if (!token || !shop) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/shops/`, {
        shop_id: shop.id,
      }, { headers });
      return res.data;
    } catch (err) {
      console.error('Add to shop favourite failed', err);
      return null;
    }
  };

  const removeShopFromFavourite = async (favId) => {
    if (!token || !favId) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/favourites/shops/${favId}/`, { headers });
    } catch (err) {
      console.error('Remove shop favourite failed', err);
    }
  };

  return {
    getFavourites,
    addToFavourite,
    removeFromFavourite,
    getShopFavourites,
    addShopToFavourite,
    removeShopFromFavourite
  };
};
