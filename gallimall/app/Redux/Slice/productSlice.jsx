'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (params = {}, { rejectWithValue }) => {
    try {
      let url = `http://127.0.0.1:8000/api/product`;

      const queryParams = [];
      if (params.categoryId) queryParams.push(`category=${params.categoryId}`);
      if (params.subcategoryId) queryParams.push(`subcategory=${params.subcategoryId}`);

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data.results || []; // <-- Support pagination
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
