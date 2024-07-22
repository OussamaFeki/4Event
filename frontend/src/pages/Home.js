import React from 'react';
import Header from '../components/forHomepage/Header';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutUspage from './AboutUspage';
import Event from './Event';
import First from './First';

export const Home = () => {
  return (
      <div>
        <Header />
        <Container className='mt-4'> {/* Adjusted margin-top */}
          <Routes>
            <Route path='' element={<First />} />
            <Route path='/events' element={<Event />} />
            <Route path='/aboutus' element={<AboutUspage />} />
          </Routes>
        </Container>
      </div>
  );
};

export default Home; // Add default export
