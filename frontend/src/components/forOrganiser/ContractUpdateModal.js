import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ContractUpdateModal = ({ show, onHide, contract, onUpdate }) => {
  const [updatedContract, setUpdatedContract] = useState(null);

  useEffect(() => {
    if (contract) {
      setUpdatedContract(contract);
    }
  }, [contract]);

  if (!updatedContract) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedContract((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    onUpdate(updatedContract);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Contract</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              value={updatedContract.price}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="terms">
            <Form.Label>Terms</Form.Label>
            <Form.Control
              as="textarea"
              name="terms"
              value={updatedContract.terms}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContractUpdateModal;