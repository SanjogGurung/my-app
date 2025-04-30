import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  allOrders: [],
  status: 'idle',
  error: null,
};

// Thunk to place an order
export const placeOrder = createAsyncThunk('order/placeOrder', async ({ shippingAddress, phoneNumber, totalAmount }, { rejectWithValue }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("shippingAddress", shippingAddress);
    formData.append("phoneNumber", phoneNumber);
    formData.append("totalAmount", totalAmount);

    const response = await axios.post('http://localhost:8082/order/create', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (err) {
    console.error('Create Order Error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to create order with Khalti.';
    return rejectWithValue(errorMessage);
  }
});

// Thunk to fetch user's orders
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

// Thunk to fetch all orders (for staff dashboard)
export const fetchAllOrders = createAsyncThunk('order/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:8082/staff/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (err) {
    console.error('Fetch All Orders Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch all orders');
  }
});

// Thunk to update tracking status (for staff dashboard)
export const updateTrackingStatus = createAsyncThunk('order/updateTrackingStatus', async ({ orderId, status, description }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`http://localhost:8082/staff/${orderId}/update-tracking`, null, {
      params: { status, description },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return { orderId, status, description };
  } catch (err) {
    console.error('Update Tracking Status Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to update tracking status');
  }
});

// Thunk to verify payment
export const verifyPayment = createAsyncThunk('order/verifyPayment', async ({ pidx, status, transactionId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `http://localhost:8082/order/verify-payment`,
      {},
      {
        params: { pidx, status, transaction_id: transactionId },
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      }
    );
    return response.data;
  } catch (err) {
    console.error('Verify Payment Error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to verify payment with Khalti.';
    return rejectWithValue(errorMessage);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearOrder(state) {
      state.orders = [];
      state.status = 'idle';
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
      // Fetch user's orders
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
      // Fetch all orders (for staff dashboard)
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Fetched all orders in reducer:', action.payload);
        state.allOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
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
        const updateOrder = (orderList) => {
          const order = orderList.find((o) => o.id === orderId);
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
        };
        updateOrder(state.orders);
        updateOrder(state.allOrders);
        state.error = null;
      })
      .addCase(updateTrackingStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError: clearOrderError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;