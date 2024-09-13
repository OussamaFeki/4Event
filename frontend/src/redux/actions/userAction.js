import { createAsyncThunk } from '@reduxjs/toolkit';
import { getdata, updateAvatar } from '../services/auth';

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getdata();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user avatar and then fetching updated user data
export const updateUserAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const data = await updateAvatar(file);
      // After updating the avatar, dispatch fetchUserData to refresh user info
      await dispatch(fetchUserData());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
