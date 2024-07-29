import { configureStore } from '@reduxjs/toolkit'
import ProviderReducer from '../reducer/ProviderReducer';
const store = configureStore({
    reducer: {
      provider: ProviderReducer,
    },
  });
  
  export default store;