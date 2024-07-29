// src/features/provider/providerReducer.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProviderData, sendProviderRequest } from '../actions/providerAction';

const initialState = {
  provider: null,
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderData.fulfilled, (state, action) => {
        state.loading = false;
        state.provider = action.payload;
      })
      .addCase(fetchProviderData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendProviderRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendProviderRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendProviderRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default providerSlice.reducer;

