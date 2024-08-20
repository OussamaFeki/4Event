import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3001'; // Replace with your actual API URL

// Function to get provider data
export const getSelfData = async (token) => {
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
// Function to update availability
export const updateAvailability = async (token, availabilityDto) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/availability/update`, availabilityDto, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};
// Function to add availability
export const addAvailability = async (token, availabilityDto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/availability/add`, availabilityDto, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};
// Function to get provider availabilities
export const getAvailabilities = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/availability/availabilities`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    throw error;
  }

};
 export const getServices= async (token)=>{
  try{
    const response=await axios.get(`${API_BASE_URL}/service/services`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    throw error;
  }
}
export const getDoghnuts = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/provider/Doghnuts`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    throw error;
  }
  
};
// Function to get doughnut chart data
export const getDoughnuts = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/provider/doghnuts`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching doughnut chart data:', error);
    throw error;
  }
};
// Function to update availability by ID
export const updateAvailabilityByID = async (token, id, availabilityDto) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/availability/update/${id}`, 
      availabilityDto, // Pass the availabilityDto in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming you're using JWT for auth
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating availability by ID:', error);
    throw error;
  }
};
export const createService = async (token, serviceDto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/service`, serviceDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};
// Function to update an existing service
export const updateService = async (token, serviceId, serviceDto) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/service/${serviceId}`, serviceDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};
// Function to delete a service by ID
export const deleteService = async (token, serviceId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/service/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
  
};
// Function to delete a service by ID
export const deleteAvailability = async (token, serviceId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/availability/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};
export const getContractForMeAndEvent = async (token,eventId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contracts/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching contract:', error);
    throw error;
  }
};