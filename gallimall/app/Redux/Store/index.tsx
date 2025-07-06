import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slice/authSlice';
import productReducer from '../Slice/productSlice' // adjust this path if needed
import categoryReducer from '../Slice/categorySlice' // adjust this path if needed
import subcategoryReducer from '../Slice/SubCategorySlice' // adjust this path if needed
import cartReducer from '../Slice/cartSlice' // adjust this path if needed
import favouriteReducer from '../Slice/favouriteSlice' // adjust this path if needed
import orderReducer from '../Slice/orderSlice'; // adjust this path if needed
import shopReducer from '../Slice/shopSlice'; // adjust this path if needed
import customerProfileReducer from '../Slice/customerSlice'
import chatbotReducer from '../Slice/chatbotSlice';
import locationReducer from '../Slice/locationSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    location: locationReducer,
    subcategory: subcategoryReducer,
     chatbot: chatbotReducer,
    cart: cartReducer,
    favourite: favouriteReducer,
    order:orderReducer,
    shop:shopReducer,
    customerProfile: customerProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
