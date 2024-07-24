import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { sendRequest } from '../services/organiserServices';

const ConfirmationModal = ({ show, handleClose, token, eventId, providerId }) => {
  const handleConfirm = async () => {
    try {
      await sendRequest(token, eventId, providerId);
      alert('Request sent successfully!');
      handleClose();
    } catch (err) {
      alert('Error sending request: ' + err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to send a request to this provider?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
