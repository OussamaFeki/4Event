import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createContract } from '../../services/organiserServices';

const ContractModal = ({ eventId, providerId, show, handleClose }) => {
  const eventIdRef = useRef(eventId);
  const providerIdRef = useRef(providerId);

  useEffect(() => {
    eventIdRef.current = eventId;
    providerIdRef.current = providerId;
  }, []);

  console.log('ContractModal props:', { eventId: eventIdRef.current, providerId: providerIdRef.current, show });

  const [form, setForm] = useState({
    terms: '',
    price: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!eventIdRef.current || !providerIdRef.current) {
      console.error('eventId or providerId is undefined', { eventId: eventIdRef.current, providerId: providerIdRef.current });
      return;
    }
    try {
      console.log('Submitting contract with:', { token, eventId: eventIdRef.current, providerId: providerIdRef.current, form });
      await createContract(token, eventIdRef.current, providerIdRef.current, form);
      handleClose();
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Contract</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="terms">
            <Form.Label>Terms</Form.Label>
            <Form.Control
              type="text"
              name="terms"
              value={form.terms}
              onChange={handleChange}
              placeholder="Enter the contract terms"
              required
            />
          </Form.Group>
          <Form.Group controlId="price" className="mt-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter the price"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Create Contract
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ContractModal;