import React from 'react';
import logo from '../../Logos/4Event.png';
import { Button, Container, Image, Nav, Navbar} from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar expand="lg" bg="primary" variant="dark" fixed="top" >
      <Container fluid>
        <Navbar.Brand href="#">
          <Image src={logo} style={{ width: '70px', height: '40px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="events">events</Nav.Link>
            <Nav.Link href="aboutus">about us</Nav.Link>
            <Nav.Link href="#action4">contact us</Nav.Link>
          </Nav>
          <div className="d-flex ms-3">
            <Button variant="outline-light" className="me-2" href='login'>Login</Button>
            <Button variant="light" href='signup'>Signup</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;


