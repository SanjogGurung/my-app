import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import wallpapersReducer from './slices/wallpapersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    wallpapers: wallpapersReducer,
    cart: cartReducer,
  },
});
  
export default store;