// src/Sidebar.js
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Speedometer2, Calendar3, People, SlashCircle } from 'react-bootstrap-icons';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
  return (
    <div className="sidebar-container">
      <Navbar expand={true} className="sidebar">
        <Container fluid>
          <Navbar.Toggle aria-controls="sidebar-nav" />
          <Navbar.Collapse id="sidebar-nav">
          <Nav  className="flex-column">
              <Nav.Link as={NavLink} to="/organizer"><Speedometer2 className="me-4" />Dashboard</Nav.Link>
              <Nav.Link as={NavLink} to="/organizer/event"><Calendar3 className="me-4" />My Events</Nav.Link>
              <Nav.Link as={NavLink} to="/organizer/providers"><People className="me-4" />Providers</Nav.Link>
              <Nav.Link as={NavLink} to="/organizer/messages"><People className="me-4" />Messages</Nav.Link>
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

