'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL_LOGIN = 'http://127.0.0.1:8000/api/login/';
const API_URL_REGISTER = 'http://127.0.0.1:8000/api/register/';
const API_URL_LOGOUT = 'http://127.0.0.1:8000/api/logout/';

// Login user thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();

      const normalizedUserType = data.user?.user_type?.toLowerCase() || 'customer';

      // Save tokens to localStorage
      localStorage.setItem("access_token", data.access || data.token?.access);
      localStorage.setItem("refresh_token", data.refresh || data.token?.refresh);

      return {
        user: {
          email: data.user.email,
          user_type: normalizedUserType,
        },
        token: data.access || data.token?.access,
        refreshToken: data.refresh || data.token?.refresh,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Register user thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();

      // Save tokens to localStorage
      localStorage.setItem("access_token", data.access || data.token?.access);
      localStorage.setItem("refresh_token", data.refresh || data.token?.refresh);

      return {
        user: {
          email: userData.email,
          user_type: userData.user_type?.toLowerCase() || 'customer',
        },
        token: data.access || data.token?.access,
        refreshToken: data.refresh || data.token?.refresh,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout user thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem('access_token');

      if (!refreshToken || !accessToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return true;
      }

      const response = await fetch(API_URL_LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Logout failed';
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
