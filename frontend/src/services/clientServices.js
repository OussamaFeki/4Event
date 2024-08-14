import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Define the base URL for your API

// Function to create a client
export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/client`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getAllUsers= async () =>{
    try{
        const response=await axios.get(`${API_BASE_URL}/client/users`)
        return response.data;
    }catch (error){
        console.error('Error creating client:', error.response ? error.response.data : error.message);
        throw error;
    }
    
    
}
