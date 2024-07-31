// src/features/provider/providerActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProviderData, sendRequest } from '../../services/organiserServices';
import { addAvailability, getAvailabilities, getSelfData } from '../../services/providerServices';

// Thunk to fetch provider data
export const fetchProviderData = createAsyncThunk(
  'provider/fetchProviderData',
  async (providerId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await getProviderData(token, providerId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk to send a request to a provider for an event
export const sendProviderRequest = createAsyncThunk(
  'provider/sendProviderRequest',
  async ({ eventId, providerId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await sendRequest(token, eventId, providerId);
      // Optionally refetch provider data after sending the request
      thunkAPI.dispatch(fetchProviderData(providerId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk to fetch provider data
export const fetchData = createAsyncThunk(
  'provider/fetchSelfData',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await getSelfData(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk to update availability
export const updateProviderAvailability = createAsyncThunk(
  'provider/updateAvailability',
  async (availabilityDto, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await addAvailability(token, availabilityDto);
      // Optionally refetch availabilities after updating
      thunkAPI.dispatch(fetchAvailabilities());
      thunkAPI.dispatch(fetchData());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk to fetch provider availabilities
export const fetchAvailabilities = createAsyncThunk(
  'provider/fetchAvailabilities',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await getAvailabilities(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
