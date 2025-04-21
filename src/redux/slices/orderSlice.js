import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { getState, rejectWithValue }) => {
      try {
        const { auth: { token } } = getState();
        const response = await fetch('http://localhost:8082/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          return rejectWithValue(errorData.message || 'Failed to fetch orders');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        return rejectWithValue('Network error');
      }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
      orders: [],
      isLoading: false,
      error: null,
    },
    reducers: {
      clearOrders(state) {
        state.orders = [];
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrders.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orders = action.payload;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { clearOrders } = orderSlice.actions;
  export default orderSlice.reducer;
