// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:8082/cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    const items = response.data;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('Fetched cart:', { items, totalQuantity, totalPrice });
    return { items, totalQuantity, totalPrice };
  } catch (err) {
    console.error('Fetch Cart Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to load cart');
  }
});

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async (item, { dispatch, rejectWithValue }) => {
  try {
    const payload = {
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity || 1,
    };
    console.log('Sending addItemToCart payload:', payload);
    const response = await axios.post('http://localhost:8082/cart/add', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    await dispatch(fetchCart());
    return response.data;
  } catch (err) {
    console.error('Add Item Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to add item to cart');
  }
});

export const incrementItemQuantity = createAsyncThunk(
  'cart/incrementItemQuantity',
  async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    try {
      if (!id || quantity == null || quantity < 0) {
        throw new Error('Invalid id or quantity');
      }
      console.log(`Incrementing item ${id} to quantity ${quantity}`);
      const response = await axios.put(
        `http://localhost:8082/cart/item/${id}/quantity`,
        { quantity }, // Send quantity in request body
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      console.log('Increment response:', response.data);
      await dispatch(fetchCart());
      return response.data;
    } catch (err) {
      console.error('Increment Item Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to increment item quantity. Item may be out of stock.');
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    try {
      if (!id || quantity == null || quantity < 0) {
        throw new Error('Invalid id or quantity');
      }
      console.log(`Decrementing item ${id} to quantity ${quantity}`);
      const response = await axios.put(
        `http://localhost:8082/cart/item/${id}/quantity`,
        { quantity }, // Send quantity in request body
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      console.log('Decrement response:', response.data);
      await dispatch(fetchCart());
      return response.data;
    } catch (err) {
      console.error('Remove Item Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const deleteItemFromCart = createAsyncThunk(
  'cart/deleteItemFromCart',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8082/cart/item/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      await dispatch(fetchCart());
      return id;
    } catch (err) {
      console.error('Delete Item Error:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to delete item');
    }
  }
);

export const clearCartItems = createAsyncThunk('cart/clearCartItems', async (_, { dispatch, rejectWithValue }) => {
  try {
    await axios.delete('http://localhost:8082/cart/clear', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    await dispatch(fetchCart());
    return null;
  } catch (err) {
    console.error('Clear Cart Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.isLoading = false;
      state.error = null;
      console.log('Cleared cart state:', JSON.stringify(state, null, 2));
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        const { items, totalQuantity, totalPrice } = action.payload;
        state.items = items || [];
        state.totalQuantity = totalQuantity || 0;
        state.totalPrice = totalPrice || 0;
        state.isLoading = false;
        state.error = null;
        console.log('Set cart state:', JSON.stringify(state, null, 2));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(incrementItemQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(incrementItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload === null) {
          state.items = state.items.filter(item => item.id !== action.meta.arg.id);
        }
      })
      .addCase(incrementItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload === null) {
          state.items = state.items.filter(item => item.id !== action.meta.arg.id);
        }
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteItemFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItemFromCart.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(clearCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;