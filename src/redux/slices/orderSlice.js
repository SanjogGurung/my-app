import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  status: 'idle',
  error: null,
};

// Thunk to place an order
export const placeOrder = createAsyncThunk('order/placeOrder', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8082/order/create', null, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (err) {
    console.error('Create Order Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

// Thunk to fetch orders
export const fetchOrders = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:8082/order/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (err) {
    console.error('Fetch Orders Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

// Thunk to update tracking status
export const updateTrackingStatus = createAsyncThunk('order/updateTrackingStatus', async ({ orderId, status, description }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`http://localhost:8082/order/update-tracking/${orderId}`, null, {
      params: { status, description },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return { orderId, status, description };
  } catch (err) {
    console.error('Update Tracking Status Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to update tracking status');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Place order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Fetched orders in reducer:', action.payload);
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update tracking status
      .addCase(updateTrackingStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTrackingStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { orderId, status, description } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = status;
          if (!order.trackingHistory) {
            order.trackingHistory = [];
          }
          order.trackingHistory.push({
            status,
            updatedAt: new Date().toISOString(),
            description,
          });
        }
        state.error = null;
      })
      .addCase(updateTrackingStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError: clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;