import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8082/product/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch products');
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);  

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://localhost:8082/product/${productId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
      }
    }
  );

export const selectDiscountedProducts = (state) =>
    state.products.products
      .filter((product) => product.discountPercentage > 0)
      .slice(0, 6); 

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearProduct(state) {
        state.product = null;
        state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProduct, clearError } = productsSlice.actions; // Export the action creators


export default productsSlice.reducer;