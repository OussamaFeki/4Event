import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createClient } from '../../services/clientServices';

const ClientModal = ({ show, onHide, userId }) => {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include userId in the client data
      const dataToSend = { ...clientData, userId };
      await createClient(dataToSend);
      onHide(); // Close the modal after successful submission
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              placeholder="Enter client's name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={clientData.email}
              onChange={handleChange}
              placeholder="Enter client's email"
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={clientData.phone}
              onChange={handleChange}
              placeholder="Enter client's phone number"
              required
            />
          </Form.Group>

          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={clientData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Enter your message"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Client
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClientModal;
