import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔍 Fetch All Shops
export const fetchAllShops = createAsyncThunk(
  'shop/fetchAllShops',
  async (_, { rejectWithValue }) => {
    try {
      // const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API}/shops/`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch shops'
      );
    }
  }
);


export const createShop = createAsyncThunk(
  'shop/createShop',
  async (shopData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.post(`${API}/shops/`, shopData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set 'Content-Type' manually
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ✅ Fetch Public Shop Details
export const fetchShopDetails = createAsyncThunk(
  'shop/fetchShopDetails',
  async (shopId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API}/shops/${shopId}/public-details/`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch shop details'
      );
    }
  }
);

export const updateShop = createAsyncThunk(
  'shop/updateShop',
  async ({ shopId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `${API}/shops/${shopId}/`,
        formData,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to update shop'
      );
    }
  }
);

// 📍 Fetch Nearest Shop ID
export const fetchNearestShopId = createAsyncThunk(
  'shop/fetchNearestShopId',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/shops/nearest/`, {
        params: { lat, lon },
      });

      if (response.data?.shopId) {
        return response.data.shopId;
      } else {
        // Handle case when detail is returned instead of shopId
        return rejectWithValue(response.data?.detail || 'No nearby shop found');
      }

    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to get nearest shop');
    }
  }
);


// 🔧 Slice
const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shop: null,
    // shops: [],
    categories: [],
    subcategories: [],
    products: [],
    nearestShopId: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetShopState: (state) => {
      state.shop = null;
      state.shops = [];
      state.categories = [];
      state.subcategories = [];
      state.products = [];
      state.nearestShopId = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(fetchAllShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createShop.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload;
        state.success = true;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateShop.pending, (state) => {
  state.loading = true;
  state.success = false;
  state.error = null;
})
.addCase(updateShop.fulfilled, (state, action) => {
  state.loading = false;
  state.shop = action.payload; // updated shop
  state.success = true;
})
.addCase(updateShop.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
  state.success = false;
})


      .addCase(fetchShopDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shop = action.payload.shop;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
        state.products = action.payload.products;
      })
      .addCase(fetchShopDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(fetchNearestShopId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearestShopId.fulfilled, (state, action) => {
        state.loading = false;
        state.nearestShopId = action.payload;
      })
      .addCase(fetchNearestShopId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetShopState } = shopSlice.actions;
export default shopSlice.reducer;
