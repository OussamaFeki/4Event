import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { sendProviderRequest } from '../redux/actions/providerAction';

const ConfirmationModal = ({ show, handleClose, token, eventId, providerId, deleteCard }) => {
  const dispatch = useDispatch();
  const { provider, loading, error } = useSelector((state) => state.provider);
  
  const handleConfirm = async () => {
    try {
      await dispatch(sendProviderRequest({ eventId, providerId })).unwrap();
      handleClose();
      if (deleteCard) {
        deleteCard(eventId);
      }
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
