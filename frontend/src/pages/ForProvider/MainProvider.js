import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getdata } from '../../services/auth';
import Navbare from '../../components/forProvider/Navbare';
import Sidebar from '../../components/forProvider/Sidebar';
import MyEvents from './MyEvents';
import Dashboard from './Dashboard';
import Requests from './Requests';
import Setting from '../both/Setting';
import Info from '../both/Info';
import { getRequests } from '../../services/providerServices';
const MainProvider = () => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (!token) {
          throw new Error('Token not found');
        }

        const data = await getdata();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div>
        <Navbare  userName={userData.name}/>
        <Sidebar>
            <Container className='mt-4'>
                <Routes>
                    <Route path='/events' element={<MyEvents/>}/>
                    <Route path='/'element={<Dashboard/>}/>
                    <Route path='/requests'element={<Requests/>}/>
                    <Route path='/settings' element={<Setting/>}/>
                    <Route path='/info' element={<Info/>} />
                </Routes>
            </Container>
        </Sidebar>
    </div>
  )
}

export default MainProvider
