import React, { useEffect, useState } from 'react';
import { createEvent, deleteEvent, getEvents } from '../../services/organiserServices';
import { Table, Button, Alert, Modal, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { XCircle, InfoCircle, PlusCircle, Search } from 'react-bootstrap-icons'

const Events = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    budget: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('name');
  //fetch Data useEffect 
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    filterData();
  }, [searchTerm, searchFilter, data]);
  //get the events from the backend 
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const events = await getEvents(token);
      setData(events);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  //methode of delete event 
  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteEvent(token, eventId);
      console.log('Event deleted successfully');
      fetchData(); // Refresh the events list
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err);
    }
  };
  //filter the Data 
  const filterData = () => {
    const filtered = data.filter(event => {
      const searchValue = event[searchFilter]?.toString().toLowerCase();
      return searchValue?.includes(searchTerm.toLowerCase());
    });
    setFilteredData(filtered);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  //the function button of the add event 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const createdEvent = await createEvent(token, newEvent);
      console.log('New event created:', createdEvent);
      setShowModal(false);
      // Refresh the events list
      fetchData();
      // Reset the form
      setNewEvent({
        name: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
      });
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err);
    }
  };
    // Function to handle sending event to provider (implementation details omitted)
  const handleSendToProvider = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      // Implement logic to send event data to provider using eventId
      console.log(`Sending event ${eventId} to provider`);
    } catch (err) {
      console.error('Error sending event to provider:', err);
      setError(err); // Optionally display an error message to the user
    }
  };
  const handleFilterChange = (filter) => {
    setSearchFilter(filter);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  return (
    <div>
       <div className="d-flex justify-content-between align-items-center mb-3">
          <InputGroup className="w-50">
            <Form.Control
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                {searchFilter.charAt(0).toUpperCase() + searchFilter.slice(1)}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleFilterChange('name')}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterChange('location')}>Location</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterChange('date')}>Date</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterChange('startTime')}>Start Time</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="outline-secondary">
              <Search />
            </Button>
          </InputGroup>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <PlusCircle size={20} className="me-2" />
            Create New Event
          </Button>
        </div>
        {filteredData.length > 0 ?(<Table striped bordered hover>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((event, index) => (
            <tr key={index}>
              <td>{event.name}</td>
              <td>{event.location || 'N/A'}</td>
              <td>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td>{event.startTime}</td>
              <td>{event.endTime}</td>
              <td>{event.payment ? event.payment.amount : 'N/A'}</td>
              <td>
                <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteEvent(event._id)}>
                  <XCircle size={16} /> delete
                </Button>
                <Button variant="info" size="sm" className="me-2">
                  <InfoCircle size={16} /> More Info
                </Button>
                <Button variant="success" size="sm" className="me-2" onClick={() => handleSendToProvider(event._id)}>
                    <PlusCircle size={16} /> Send to Provider
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>): (
      <Alert variant="primary">there is no event .</Alert>
    )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control type="text" name="name" value={newEvent.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={newEvent.location} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={newEvent.date} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="time" name="startTime" value={newEvent.startTime} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control type="time" name="endTime" value={newEvent.endTime} onChange={handleInputChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Events;