import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { sendProviderRequest } from '../redux/actions/providerAction';
import ContractModal from './forOrganiser/ContractModal';

const ConfirmationModal = ({ show, handleClose, token, eventId, providerId, deleteCard }) => {
  const dispatch = useDispatch();
  const { provider, loading, error } = useSelector((state) => state.provider);
  const [showContractModal, setShowContractModal] = useState(false);
  
  const eventIdRef = useRef(eventId);
  const providerIdRef = useRef(providerId);

  useEffect(() => {
    if (eventId) eventIdRef.current = eventId;
    if (providerId) providerIdRef.current = providerId;
  }, [eventId, providerId]);

  console.log('ConfirmationModal props:', { show, token, eventId: eventIdRef.current, providerId: providerIdRef.current });

  const handleConfirm = async () => {
    if (!eventIdRef.current || !providerIdRef.current) {
      console.error('eventId or providerId is undefined', { eventId: eventIdRef.current, providerId: providerIdRef.current });
      return;
    }

    try {
      console.log('Sending provider request with:', { eventId: eventIdRef.current, providerId: providerIdRef.current });
      await dispatch(sendProviderRequest({ eventId: eventIdRef.current, providerId: providerIdRef.current })).unwrap();
      handleClose();
      setShowContractModal(true);
      if (deleteCard) {
        deleteCard(eventIdRef.current);
      }
    } catch (err) {
      console.error('Error sending request:', err);
      alert('Error sending request: ' + err.message);
    }
  };

  const handleContractModalClose = () => {
    setShowContractModal(false);
  };

  return (
    <>
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
          <Button variant="primary" onClick={handleConfirm} disabled={!eventIdRef.current || !providerIdRef.current}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {showContractModal && eventIdRef.current && providerIdRef.current && (
        <ContractModal
          show={showContractModal}
          handleClose={handleContractModalClose}
          eventId={eventIdRef.current}
          providerId={providerIdRef.current}
        />
      )}
    </>
  );
};

export default ConfirmationModal;