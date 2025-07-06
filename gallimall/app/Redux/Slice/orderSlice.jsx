import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (productId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth?.token || localStorage.getItem('access_token');
    console.log('Token used for auth:', token);

    const response = await fetch(`${API_BASE_URL}/create_order/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  body: JSON.stringify({ product_id: productId }),
});


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create order');
    }

    return await response.json();
  }
);

export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async (paymentData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth?.token || localStorage.getItem('access_token');
    console.log('Token used for payment verification:', token);

    const response = await fetch(`${API_BASE_URL}/verify_payment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) throw new Error('Payment verification failed');
    return await response.json();
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    paymentStatus: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.paymentStatus = null;
      state.loading = false;
      state.error = null;
    },
    loadOrderFromStorage: (state, action) => {
      state.order = action.payload.order;
      state.paymentStatus = action.payload.paymentStatus;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = {
          razorpay_payment_id: action.payload.razorpay_payment_id,
          razorpay_signature: action.payload.razorpay_signature,
        };
        state.order = action.payload.order;

        if (typeof window !== 'undefined') {
          const existingOrders = JSON.parse(localStorage.getItem('successfulOrders')) || [];

          const newOrderEntry = {
            order: action.payload.order,
            paymentStatus: {
              razorpay_payment_id: action.payload.razorpay_payment_id,
              razorpay_signature: action.payload.razorpay_signature,
            },
            timestamp: new Date().toISOString(),
          };

          localStorage.setItem('successfulOrders', JSON.stringify([...existingOrders, newOrderEntry]));
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { resetOrderState, loadOrderFromStorage } = orderSlice.actions;

export default orderSlice.reducer;
