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
  }catch{

  }
}