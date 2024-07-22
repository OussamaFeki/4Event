import React from 'react';
import './App.css';
import Home from './pages/Home'; // Removed named import
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';


import { AuthProvider } from './guard/AuthContext';
import MainUser from './pages/ForOrganizerPage/Main';
import Signup from './pages/signup';
import CreateProfile from './pages/CreateProfile';
import MainProvider from './pages/ForProvider/MainProvider';
import UserRoute from './guard/UserRoute';
import ProviderRoute from './guard/ProviderRoute';
import Unauthorized from './pages/Unauthorized';


function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/createProfile" element={<CreateProfile/>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<ProviderRoute />}>
              <Route path="/provider/*" element={<MainProvider />} />
            </Route>
            <Route element={<UserRoute />}>
              <Route path="/organizer/*" element={<MainUser />} />
            </Route>
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
