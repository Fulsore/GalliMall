'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

// Get customer profile
export const fetchCustomerProfile = createAsyncThunk(
  'customer/fetchCustomerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE}/customer/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch profile');
    }
  }
);

// Update customer profile
export const updateCustomerProfile = createAsyncThunk(
  'customer/updateCustomerProfile',
  async (updatedData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put(`${API_BASE}/customer/profile/update/`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update profile');
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customer: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCustomerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateCustomerProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
