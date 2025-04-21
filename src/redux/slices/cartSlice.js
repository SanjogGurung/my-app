import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Thunk to fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:8082/cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    const items = response.data; // Expecting array of CartItem
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('Fetched cart:', { items, totalQuantity, totalPrice });
    return { items, totalQuantity, totalPrice };
  } catch (err) {
    console.error('Fetch Cart Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to load cart');
  }
});

// Thunk to add item to cart
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
    return {
      id: response.data.id,
      price: response.data.price,
      quantity: response.data.quantity,
      productName: response.data.productName,
    };
  } catch (err) {
    console.error('Add Item Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to add item to cart');
  }
});

// Thunk to increment item quantity
export const incrementItemQuantity = createAsyncThunk(
  'cart/incrementItemQuantity',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const item = cart.items.find((item) => item.id === id);
      if (!item) {
        throw new Error('Item not found in cart');
      }
      const newQuantity = item.quantity + 1;
      await axios.put(
        `http://localhost:8082/cart/item/${id}/quantity`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      // await dispatch(fetchCart());
      return { id, price: item.price, quantity: 1, productName: item.productName };
    } catch (err) {
      console.error('Increment Item Error:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to increment item quantity');
    }
  }
);

// Thunk to remove item (reduce quantity by 1)
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const item = cart.items.find((item) => item.id === id);
      if (!item) {
        throw new Error('Item not found in cart');
      }
      const newQuantity = item.quantity - 1;
      if (newQuantity <= 0) {
        await axios.delete(`http://localhost:8082/cart/item/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
      } else {
        await axios.put(
          `http://localhost:8082/cart/item/${id}/quantity`,
          { quantity: newQuantity },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }
        );
      }
      // await dispatch(fetchCart());
      return id;
    } catch (err) {
      console.error('Remove Item Error:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

// Thunk to delete item (remove entirely)
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

// Thunk to clear cart
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

// Thunk to place order
export const placeOrder = createAsyncThunk('cart/placeOrder', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8082/order/create', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    await dispatch(fetchCart());
    return response.data;
  } catch (err) {
    console.error('Create Order Error:', err);
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
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
  },
  extraReducers: (builder) => {
    // fetchCart
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
      });

    // addItemToCart
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        console.log('addItemToCart fulfilled:', newItem);
        if (!newItem.id || typeof newItem.price !== 'number' || isNaN(newItem.price)) {
          console.error('Invalid item:', newItem);
          state.error = 'Invalid item received';
          state.isLoading = false;
          return;
        }

        const existingItem = state.items.find((item) => item.id === newItem.id);

        if (existingItem) {
          existingItem.quantity += newItem.quantity || 1;
          existingItem.totalPrice += newItem.price * (newItem.quantity || 1);
        } else {
          state.items.push({
            ...newItem,
            quantity: newItem.quantity || 1,
            totalPrice: newItem.price * (newItem.quantity || 1),
          });
        }

        state.totalQuantity += newItem.quantity || 1;
        state.totalPrice += newItem.price * (newItem.quantity || 1);
        state.isLoading = false;
        state.error = null;
        console.log('Updated cart state:', JSON.stringify(state, null, 2));
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // incrementItemQuantity
    builder
      .addCase(incrementItemQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(incrementItemQuantity.fulfilled, (state, action) => {
        const newItem = action.payload;
        console.log('incrementItemQuantity fulfilled:', newItem);
        if (!newItem.id || typeof newItem.price !== 'number' || isNaN(newItem.price)) {
          console.error('Invalid item:', newItem);
          state.error = 'Invalid item received';
          state.isLoading = false;
          return;
        }

        const existingItem = state.items.find((item) => item.id === newItem.id);

        if (existingItem) {
          existingItem.quantity += newItem.quantity || 1;
          existingItem.totalPrice += newItem.price * (newItem.quantity || 1);
        } else {
          state.items.push({
            ...newItem,
            quantity: newItem.quantity || 1,
            totalPrice: newItem.price * (newItem.quantity || 1),
          });
        }

        state.totalQuantity += newItem.quantity || 1;
        state.totalPrice += newItem.price * (newItem.quantity || 1);
        state.isLoading = false;
        state.error = null;
        console.log('Updated cart state:', JSON.stringify(state, null, 2));
      })
      .addCase(incrementItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // removeItemFromCart
    builder
      .addCase(removeItemFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const id = action.payload;
        const existingItem = state.items.find((item) => item.id === id);
        if (!existingItem) {
          console.error('Item not found:', id);
          state.isLoading = false;
          return;
        }

        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }

        state.totalQuantity--;
        state.totalPrice -= existingItem.price;
        state.isLoading = false;
        state.error = null;
        console.log('Updated cart state:', JSON.stringify(state, null, 2));
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // deleteItemFromCart
    builder
      .addCase(deleteItemFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItemFromCart.fulfilled, (state, action) => {
        const id = action.payload;
        const existingItem = state.items.find((item) => item.id === id);
        if (!existingItem) {
          console.error('Item not found:', id);
          state.isLoading = false;
          return;
        }

        state.items = state.items.filter((item) => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.isLoading = false;
        state.error = null;
        console.log('Updated cart state:', JSON.stringify(state, null, 2));
      })
      .addCase(deleteItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // clearCartItems
    builder
      .addCase(clearCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.isLoading = false;
        state.error = null;
        console.log('Cleared cart state:', JSON.stringify(state, null, 2));
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.isLoading = false;
        state.error = null;
        console.log('Order placed, cleared cart:', JSON.stringify(state, null, 2));
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;