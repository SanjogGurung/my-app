import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8082/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Invalid credentials');
      }
      const data = await response.json();

      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      } else {
        console.warn('Token not found in login response:', data);
        return rejectWithValue('Token not received from server');
      }
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ userData, photo }, { getState, rejectWithValue }) => {
    try {
      const { token, user } = getState().auth;
      const formData = new FormData();
      formData.append('userData', JSON.stringify(userData));
      if (photo) {
        formData.append('photo', photo);
      }
      const response = await axios.put(
        `http://localhost:8082/user/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        }
      );
      return response.data; // axios automatically parses JSON
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(error.response.data.message || 'Failed to update user');
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue('Network error: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue('Request setup error');
      }
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;