import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SendModal = ({ show, onHide, userId, clientEmail, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // Here you can handle the message sending logic
    onSendMessage(userId, clientEmail, message);
    setMessage(''); // Clear the message input after sending
    onHide(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Send Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendMessage}>
          Send Message
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendModal;
