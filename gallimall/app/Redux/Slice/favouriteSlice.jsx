// Redux/Slice/favouriteSlice.js
import { createSlice } from '@reduxjs/toolkit';

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState: [],
  reducers: {
    addToFavourite: (state, action) => {
      const exists = state.find(item => item.id === action.payload.id);
      if (!exists) state.push(action.payload);
    },
    removeFromFavourite: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },
    clearFavourites: () => [],
  },
});

export const { addToFavourite, removeFromFavourite, clearFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
