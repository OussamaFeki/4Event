import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ServiceModal = ({ show, handleClose, handleSave, name, description, price }) => {
  const [serviceName, setServiceName] = useState(name);
  const [serviceDescription, setServiceDescription] = useState(description);
  const [servicePrice, setServicePrice] = useState(price);

  useEffect(() => {
    setServiceName(name);
    setServiceDescription(description);
    setServicePrice(price);
  }, [name, description, price]);

  const onSave = () => {
    const updatedService = {
      name: serviceName,
      description: serviceDescription,
      price: servicePrice,
    };
    handleSave(updatedService);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formServiceName">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter service name"
            />
          </Form.Group>

          <Form.Group controlId="formServiceDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Enter service description"
            />
          </Form.Group>

          <Form.Group controlId="formServicePrice" className="mt-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              placeholder="Enter service price"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceModal;
