import React from 'react';
import { Navbar, Nav, Container, Form, Button, Image, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { PersonCircle, Gear, InfoCircle, BoxArrowRight } from 'react-bootstrap-icons';
import './Navbare.css'; // Import custom CSS for additional styling
import logo from '../../Logos/4Event.png';
import { useAuth } from '../../guard/AuthContext';

const Navbare = ({ userName, userAvatar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          <Image src={logo} style={{ width: '70px', height: '25px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-center">
          <Form className="d-flex mx-auto search-bar">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav className="ms-auto user-info">
            <NavDropdown
              title={
                <>
                  {userAvatar ? (
                    <Image src={userAvatar} roundedCircle style={{ width: '30px', height: '30px' }} className="me-2" />
                  ) : (
                    <PersonCircle size={30} className="me-2" />
                  )}
                  <span>{userName}</span>
                </>
              }
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item as={NavLink} to="/provider/settings">
                <Gear className="me-2" /> Settings
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/provider/info">
                <InfoCircle className="me-2" /> Info
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <BoxArrowRight className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbare;
