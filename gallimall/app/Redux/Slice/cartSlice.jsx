import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:8000/api';

const initialState = {
  cart_code: typeof window !== 'undefined' ? localStorage.getItem('cart_code') : null,
  items: [],
  status: null,
  error: null,
};

// 🔁 Fetch cart items (for logged in or guest)
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async ({ token, cart_code }, thunkAPI) => {
    try {
      const url = token
        ? `${API_BASE}/cart-items/`
        : `${API_BASE}/cart-items/?cart_code=${cart_code}`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json(); // expects plain list of cart items
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ➕ Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, token, cart_code }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/cart-items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ product: productId, quantity, cart_code }),
      });

      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.cart_code = null;
      state.status = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_code');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload; // expects plain list
        state.status = 'succeeded';
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ addToCart
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload;

        // Save cart_code if received
        if (newItem.cart_code) {
          state.cart_code = newItem.cart_code;
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart_code', newItem.cart_code);
          }
        }

        // Update or add the cart item
        const existingIndex = state.items.findIndex(
          (i) => i.product === newItem.product
        );
        if (existingIndex !== -1) {
          state.items[existingIndex] = newItem;
        } else {
          state.items.push(newItem);
        }
        state.status = 'succeeded';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
