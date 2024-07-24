import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3001'; // Replace with your actual API URL

// Function to get provider data
export const getProviderData = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/provider/data`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
};

// Function to accept an event
export const acceptEvent = async (token, eventId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/events/${eventId}/accept`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error accepting event:', error);
    throw error;
  }
};

// Function to refuse an event
export const refuseEvent = async (token, eventId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/events/${eventId}/refuse`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error refusing event:', error);
    throw error;
  }
};
export const getRequests = async (token)=>{
  try{
    const response =await axios.get(`${API_BASE_URL}/events/provider/requests`,{
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
}
export const getAvailabilitypercentage = async (token)=>{
  try{
    const response =await axios.get(`${API_BASE_URL}/events/provider/availability-percentage`,{
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
}
export const getProviderStats =async (token)=>{
  try{
    const response =await axios.get(`${API_BASE_URL}/events/provider/stats`,{
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
}
// Function to get monthly budget sum
export const getMonthlyBudgetSum = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/provider/monthly-budget`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching monthly budget sum:', error);
    throw error;
  }
};