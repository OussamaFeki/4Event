import React, { useState } from 'react';
import { Card, Button, Pagination, Container, Row, Col } from 'react-bootstrap';
import ConfirmationModal from '../ConfirmationModal';

const EventList = ({ slotEvents, providerId }) => {
  //for pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = slotEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(slotEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  //for Confirmation and send request
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [sentRequests, setSentRequests] = useState({});
  const token = localStorage.getItem('token');
  
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };
  
  const handleOpenConfirmationModal = (eventId) => {
    setSelectedEventId(eventId);
    setShowConfirmationModal(true);
  };
  
  const handleConfirmRequest = (eventId) => {
    setSentRequests((prev) => ({
      ...prev,
      [eventId]: true
    }));
    handleCloseConfirmationModal();
  };

  return (
    <Container>
      {slotEvents.length > 0 ? (
        <>
          <Row>
            {currentEvents.map((event, index) => (
              <Col md={4} key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Text>
                      {event.startTime} - {event.endTime}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleOpenConfirmationModal(event._id)}
                      disabled={sentRequests[event._id]}
                    >
                      {sentRequests[event._id] ? 'Request Sent' : 'Invite'}
                    </Button>
                  </Card.Body>
                </Card>
                <ConfirmationModal
                  show={showConfirmationModal && selectedEventId === event._id}
                  handleClose={handleCloseConfirmationModal}
                  token={token}
                  eventId={event._id}
                  providerId={providerId}
                  onConfirm={() => handleConfirmRequest(event._id)}
                />
              </Col>
            ))}
          </Row>
          <Pagination className="justify-content-center mt-3">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      ) : (
        <p>No events in this slot.</p>
      )}
    </Container>
  );
};

export default EventList;
