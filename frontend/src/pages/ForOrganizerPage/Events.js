import React, { useEffect, useState } from 'react';
import { createEvent, deleteEvent, getEvents } from '../../services/organiserServices';
import { Table, Button, Alert, Modal, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { XCircle, InfoCircle, PlusCircle, Search } from 'react-bootstrap-icons';
import ProviderModal from '../../components/forOrganiser/ProviderModal';
import EventInfo from '../../components/forOrganiser/EventInfo';

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
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [token, setToken] = useState(null);
  const [showEventInfo, setShowEventInfo] = useState(false); // New state for EventInfo modal
  const [selectedEvent, setSelectedEvent] = useState(null); // New state for selected event

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken); 
    fetchData(storedToken);
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, searchFilter, data]);

  const fetchData = async (token) => {
    try {
      const events = await getEvents(token);
      console.log(events);
      setData(events);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(token, eventId);
      console.log('Event deleted successfully');
      fetchData(token); 
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdEvent = await createEvent(token, newEvent);
      console.log('New event created:', createdEvent);
      setShowModal(false);
      fetchData(token);
      setNewEvent({
        name: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        budget: ''
      });
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err);
    }
  };

  const handleSendToProvider = (eventId) => {
    setSelectedEventId(eventId);
    setShowProviderModal(true);
  };

  const handleFilterChange = (filter) => {
    setSearchFilter(filter);
  };

  const handleCloseProviderModal = () => {
    setShowProviderModal(false);
    setSelectedEventId(null);
  };

  const handleShowEventInfo = (event) => {
    setSelectedEvent(event); // Set the selected event
    setShowEventInfo(true);  // Show the EventInfo modal
  };

  const handleCloseEventInfo = () => {
    setShowEventInfo(false); // Close the EventInfo modal
    setSelectedEvent(null);  // Clear the selected event
  };

  if (loading) {
    return <div>Loading..</div>;
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
      {filteredData.length > 0 ? (
        <Table striped bordered hover>
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
            {filteredData.map((event, index) => (
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
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleShowEventInfo(event)}>
                    <InfoCircle size={16} /> More Info
                  </Button>
                  <Button variant="success" size="sm" className="me-2" onClick={() => handleSendToProvider(event._id)}>
                    <PlusCircle size={16} /> Send to Provider
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="primary">There is no event.</Alert>
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
      <ProviderModal
        show={showProviderModal}
        handleClose={handleCloseProviderModal}
        eventId={selectedEventId}
        token={token}
      />
      <EventInfo 
        show={showEventInfo}
        onHide={handleCloseEventInfo}
        event={selectedEvent}
      />
    </div>
  );
};

export default Events;
