import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { updateProfile } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
const CreateProfile = () => {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();
   

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateProfile(address, phoneNumber, bio);
    console.log('Address:', address);
    console.log('Phone Number:', phoneNumber);
    console.log('Bio:', bio);
    
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    if (decodedToken.providerId) {
      
        navigate('/provider');
      
        navigate('/createProfile');
      }
     else if (decodedToken.userId) {
      navigate('/organizer');
    }
  };
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 mt-4">
      <div className="profile-container border border-3 p-4">
        <h2 className="profile-header">Create Profile</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formBasicPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formBasicBio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            Create Profile
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CreateProfile;