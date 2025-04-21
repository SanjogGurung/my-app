import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';
import { jwtDecode } from 'jwt-decode';

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Logging in with credentials:', credentials);
      const response = await axios.post('http://localhost:8082/user/login', credentials);
      console.log('Login response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        console.log('Token saved to localStorage:', response.data.token.substring(0, 20) + '...');
        if (!localStorage.getItem('authToken')) {
          console.error('Failed to persist authToken in localStorage');
          return rejectWithValue('Failed to save token');
        }

        // Extract user data from token
        const decoded = jwtDecode(response.data.token);
        const user = {
          id: decoded.id,
          email: decoded.sub,
          role: decoded.role.replace('ROLE_', '').toLowerCase(), // Ensure 'user'
        };
        console.log('User data from token:', user);
        return { token: response.data.token, user };
      } else {
        console.warn('Token not found in login response:', response.data);
        return rejectWithValue('Token not received from server');
      }
    } catch (error) {
      console.error('Login error:', error.response?.status, error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Invalid credentials');
    }
  }
);

// Initialize auth state on app load
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Checking authToken in localStorage:', token ? 'Present' : 'Missing');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log('Token decoded:', decoded);
      if (decoded.exp < currentTime) {
        console.log('Token expired, exp:', decoded.exp, 'currentTime:', currentTime);
        localStorage.removeItem('authToken');
        return rejectWithValue('Token expired');
      }

      // Use token claims for user data
      const user = {
        id: decoded.id,
        email: decoded.sub,
        role: decoded.role.replace('ROLE_', '').toLowerCase(), // Ensure 'user'
      };
      console.log('User data from token:', user);
      return { token, user };
    } catch (error) {
      console.error('initializeAuth error:', error);
      localStorage.removeItem('authToken');
      return rejectWithValue('Invalid token or decode error');
    }
  }
);

// Update user thunk
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('updateUser error:', error.response?.status, error.response?.data);
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update user');
      } else if (error.request) {
        return rejectWithValue('Network error: No response from server');
      } else {
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
      localStorage.removeItem('authToken');
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
        console.log('login.fulfilled: Updated auth state:', {
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log('initializeAuth.fulfilled: Updated auth state:', {
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
        });
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
