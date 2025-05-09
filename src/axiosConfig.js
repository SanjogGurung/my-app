import axios from 'axios';
import { logout } from './redux/slices/authSlice';

let storeInstance = null;

export const setStore = (store) => {
  storeInstance = store;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized detected for:', error.config.url);
      // Skip logout/redirect for user endpoints
      if (!error.config.url.includes('/user/')) {
        console.log('Dispatching logout due to 401');
        if (storeInstance) {
          storeInstance.dispatch(logout());
        }
        // Remove the redirect; let ProtectedRoute handle navigation
        console.log('Skipping redirect; ProtectedRoute will handle navigation');
      } else {
        console.log('Skipping logout for user endpoint:', error.config.url);
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;