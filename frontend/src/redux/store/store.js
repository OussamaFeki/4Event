import { configureStore } from '@reduxjs/toolkit'
import ProviderReducer from '../reducer/ProviderReducer';
import UserReducer from '../reducer/UserReducer';
const store = configureStore({
    reducer: {
      provider: ProviderReducer,
      user:UserReducer
    },
  });
  
  export default store;