import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import wallpapersReducer from './slices/wallpapersSlice';
import orderReducer from './slices/orderSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    wallpapers: wallpapersReducer,
    cart: cartReducer,
    orders: orderReducer
  },
});
  
export default store;