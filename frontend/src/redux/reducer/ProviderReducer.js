// src/features/provider/providerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProviderData, sendProviderRequest, fetchData, fetchAvailabilities, updateProviderAvailability, fetchServices } from '../actions/providerAction';

const initialState = {
  provider: null,
  loading: false,
  error: null,
  availabilities: [],
  selfData: null,
  services: [], // Add a new state for services
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
      })
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.selfData = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailabilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailabilities.fulfilled, (state, action) => {
        state.loading = false;
        state.availabilities = action.payload;
      })
      .addCase(fetchAvailabilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProviderAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProviderAvailability.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProviderAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload; // Store the fetched services in state
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default providerSlice.reducer;
