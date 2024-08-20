import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RequestInfoModal = ({ show, handleClose, request }) => {
  if (!request) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Event Information</h5>
        <p><strong>Event Name:</strong> {request.name}</p>
        <p><strong>Location:</strong> {request.location || 'N/A'}</p>
        <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString('en-GB')}</p>
        <p><strong>Start Time:</strong> {request.startTime}</p>
        <p><strong>End Time:</strong> {request.endTime}</p>
        <p><strong>Budget:</strong> {request.payment ? request.payment.amount : 'N/A'}</p>
        
        <h5>Organizer Information</h5>
        <p><strong>Name:</strong> {request.organizer.name}</p>
        <p><strong>Email:</strong> {request.organizer.email}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestInfoModal;
