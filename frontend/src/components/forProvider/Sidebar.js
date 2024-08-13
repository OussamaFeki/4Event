// src/Sidebar.js
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Speedometer2, Calendar3, Calendar2, Clock, Gear } from 'react-bootstrap-icons';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
  return (
    <div className="sidebar-container">
      <Navbar expand={true} className="sidebar">
        <Container fluid>
          <Navbar.Toggle aria-controls="sidebar-nav" />
          <Navbar.Collapse id="sidebar-nav">
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link as={NavLink} to="/provider"><Speedometer2 className="me-4" />Dashboard</Nav.Link>
              <Nav.Link as={NavLink} to="/provider/events"><Calendar3 className="me-4" />Calendar</Nav.Link>
              <Nav.Link as={NavLink} to="/provider/requests"><Calendar2 className="me-4" />Requests</Nav.Link>
              <Nav.Link as={NavLink} to="/provider/manage"><Clock className="me-4" />Availability</Nav.Link>
              <Nav.Link as={NavLink} to="/provider/services"><Gear className="me-4" />Services</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
