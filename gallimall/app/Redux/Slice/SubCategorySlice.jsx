'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/subcategory/';

export const fetchSubCategory = createAsyncThunk(
  'subcategory/fetchSubCategory',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

const subCategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    subcategories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subcategories = action.payload;
      })
      .addCase(fetchSubCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default subCategorySlice.reducer;
