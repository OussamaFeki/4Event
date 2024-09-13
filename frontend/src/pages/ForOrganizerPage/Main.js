import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/forOrganiser/Sidebar';
import Navbare from '../../components/forOrganiser/Navbar';
import Dashboard from './Dashboard';
import Events from './Events';
import Providers from './Providers';
import ProviderCalender from './ProviderCalender';  // Import the ProviderCalender component
import Setting from '../both/Setting';
import Messages from './Messages';
import { fetchUserData } from '../../redux/actions/userAction';  

const MainUser = () => {
  const dispatch = useDispatch();
  
  // Accessing user state from Redux store
  const { user, loading, error } = useSelector((state) => state.user);

  // Dispatch fetchUserData action when the component mounts
  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {user && (
        <>
          <Navbare userName={user.name} userAvatar={user.avatar} />
          <Sidebar>
            <Container className="mt-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/event" element={<Events />} />
                <Route path="/providers" element={<Providers />} />
                <Route path="/provider-calendar" element={<ProviderCalender userId={user._id} />} />
                <Route path="/settings" element={<Setting />} />
                <Route path="/messages" element={<Messages />} />
              </Routes>
            </Container>
          </Sidebar>
        </>
      )}
    </div>
  );
};

export default MainUser;
