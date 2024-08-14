import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3001'; 

// Service to send a request to a provider for an event
export const sendRequest = async (token, eventId, providerId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/events/${eventId}/request/${providerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending request:', error);
    throw error;
  }
};
export const getEvents =async(token)=>{
    try {
        const response = await axios.get(
          `${API_BASE_URL}/events/organizer/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('Error sending request:', error);
        throw error;
      }
}
export const createEvent = async (token, eventData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/events/create`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};
export const deleteEvent=async(token,eventId)=>{
  try{
    const response = await axios.delete(
      `${API_BASE_URL}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }catch(error){
    console.error('Error creating event:', error);
    throw error;
  }
};
// New function to get available providers for an event
export const getAvailableProvidersForEvent = async (token, eventId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/events/${eventId}/available-providers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting available providers:', error);
    throw error;
  }
};
export const getProviders=async()=>{
  try {
    const response = await axios.get(`${API_BASE_URL}/users/providers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}
// New function to get events between specified times
export const getEventsBetween = async (token, date,startTime, endTime) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/events/between`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date: date, startTime, endTime },
      }
    );
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events between:', error);
    throw error;
  }
};
export const getProviderData = async (token, id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/provider/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
};
export const getMessages = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/message/my-messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching provider data:', error);
    throw error;
  }
}