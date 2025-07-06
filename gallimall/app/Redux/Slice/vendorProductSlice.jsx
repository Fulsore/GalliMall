// vendorProductSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'

export const createVendorProduct = createAsyncThunk(
  'vendorProducts/createVendorProduct',
  async (productData, { rejectWithValue }) => {
    const token = localStorage.getItem('access_token');
    if (!token) return rejectWithValue('No auth token found');

    try {
      const response = await axios.post(`${API_URL}/vendor/products/`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err.message);
    }
  }
);


const vendorProductSlice = createSlice({
  name: 'vendorProducts',
  initialState: { products: [], status: 'idle', error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createVendorProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createVendorProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createVendorProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default vendorProductSlice.reducer;
