import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/forOrganiser/Sidebar';
import Navbare from '../../components/forOrganiser/Navbar';
import { getdata } from '../../services/auth';
import Dashboard from './Dashboard';
import Events from './Events';
const MainUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      <Navbare userName={userData.name}/>
      <Sidebar>
        <Container className='mt-4'> {/* Adjusted margin-top */}
            <Routes>
              <Route path='/event' element={<Events />}/>
              <Route path='/' element={<Dashboard/>}/>
            </Routes>
        </Container>
      </Sidebar>
      
    </div>
  )
}

export default MainUser;
