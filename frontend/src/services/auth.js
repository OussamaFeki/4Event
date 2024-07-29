// auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Update this with your actual backend URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
};

export const signup = async (name,email, password, role) => {
  try {
    if(role==='organizer'){
      const response = await axios.post(`${API_URL}/users/signup`, { name,email, password});
      return response.data;
    }else if(role==='provider'){
      const response = await axios.post(`${API_URL}/provider/signup`, { name,email, password});
      return response.data;
    }
    return null
  } catch (error) {
    throw new Error(error.response.data.message || 'Signup failed');
  }
};
export const updateProfile = async (address, phoneNumber, bio) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You are not logged in');
    }

    const data = {
      address,
      phoneNumber,
      bio,
    };

    const response = await axios.put(`${API_URL}/profile/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Update profile failed');
  }
  
};
export const hasProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You are not logged in');
    }

    const response = await axios.get(`${API_URL}/profile/has-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to check if user has a profile');
  }
 
};
export const getdata=async()=>{
  try{
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You are not logged in');
    }

    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)
    return response.data;
  }catch (error){
    throw new Error(error.response.data.message || 'get data failed');
  }
  
}
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You are not logged in');
    }

    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Get profile failed');
  }
};
