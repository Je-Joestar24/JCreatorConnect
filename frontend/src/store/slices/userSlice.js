import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../../services/user/authService.js';

// Initialize state from localStorage
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,
      userLogged: !!storedToken,
      loading: false,
      error: null,
      signupErrors: null,
      signupMessage: null,
    };
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return {
      user: null,
      token: null,
      userLogged: false,
      loading: false,
      error: null,
      signupErrors: null,
      signupMessage: null,
    };
  }
};

// Async thunk for registration
export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    const result = await registerUser({ name, email, password, role });
    
    if (result.success) {
      // Store token and user in localStorage
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
      }
      if (result.data.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return {
        user: result.data.user || null,
        token: result.data.token || null,
        message: result.message || 'Registration successful',
      };
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    const result = await loginUser({ email, password });
    
    if (result.success) {
      // Store token and user in localStorage
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
      }
      if (result.data.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return {
        user: result.data.user || null,
        token: result.data.token || null,
        message: result.message || 'Login successful',
      };
    } else {
      return rejectWithValue({
        error: result.error,
        errors: result.errors,
      });
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    const result = await logoutUser();
    
    // Clear localStorage regardless of API response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (result.success) {
      return {
        message: result.message || 'Logout successful',
      };
    } else {
      // Even if API fails, we clear local storage
      return {
        message: 'Logged out successfully',
      };
    }
  }
);

// Async thunk for getting current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const result = await getCurrentUser();
    
    if (result.success) {
      // Update localStorage with fresh user data
      if (result.data) {
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      return result.data;
    } else {
      // If token is invalid, clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(result.error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    setLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload || null;
    },
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userLogged = !!action.payload.token;
      state.error = null;
      
      // Update localStorage
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.userLogged = false;
      state.error = null;
      state.signupErrors = null;
      state.signupMessage = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearErrors: (state) => {
      state.error = null;
      state.signupErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register reducers
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupErrors = null;
        state.signupMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userLogged = !!action.payload.token;
        state.signupMessage = action.payload.message;
        state.signupErrors = null;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
        state.signupErrors = action.payload?.errors || null;
        state.userLogged = false;
      })
      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userLogged = !!action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Login failed';
        state.userLogged = false;
      })
      // Logout reducers
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.userLogged = false;
        state.error = null;
        state.signupErrors = null;
        state.signupMessage = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Even if logout fails, clear the state
        state.user = null;
        state.token = null;
        state.userLogged = false;
      })
      // Fetch current user reducers
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.userLogged = false;
      });
  },
});

export const { setAuth, clearAuth, setLoading, setError, clearErrors } = userSlice.actions;
export default userSlice.reducer;
