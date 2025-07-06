import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    current: null,
  },initialState: {
    current: {
      name: '',
      lat: null,
      lon: null,
    },
  },
  reducers: {
    setLocation: (state, action) => {
      state.current = action.payload;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
