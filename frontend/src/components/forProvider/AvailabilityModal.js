import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AvailabilityModal = ({ show, handleClose, handleSave }) => {
  const [availability, setAvailability] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleSave(availability);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Availability</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="dayOfWeek">
            <Form.Label>Day of the Week</Form.Label>
            <Form.Control
              as="select"
              name="dayOfWeek"
              value={availability.dayOfWeek}
              onChange={handleChange}
            >
              <option value="">Select a day</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={availability.startTime}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={availability.endTime}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvailabilityModal;
