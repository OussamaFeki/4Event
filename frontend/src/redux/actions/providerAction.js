// src/features/provider/providerActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProviderData, sendRequest } from '../../services/organiserServices';


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


