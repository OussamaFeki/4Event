import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Row, Overlay, Tooltip, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilities } from '../../redux/actions/providerAction';
import AvailabilityModal from '../../components/forProvider/AvailabilityModal';
import { deleteAvailability, updateAvailabilityByID } from '../../services/providerServices';

const ManageAvailability = () => {
  const dispatch = useDispatch();
  const { availabilities, loading, error } = useSelector((state) => state.provider); // Adjust according to your state structure
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('dayOfWeek');
  const target = useRef(null);
  const availabilitiesPerPage = 3;

  useEffect(() => {
    dispatch(fetchAvailabilities());
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await deleteAvailability(token, id);
      dispatch(fetchAvailabilities());
      setDeleteError(null);
      setShowOverlay(false);
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'An error occurred while deleting the availability.');
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 3000); // Hide overlay after 3 seconds
    }
  };

  const handleUpdate = (availability) => {
    setSelectedAvailability(availability);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAvailability(null);
  };

  const handleSave = async (updatedAvailability) => {
    const token = localStorage.getItem('token'); // Adjust based on your token storage method
    try {
      await updateAvailabilityByID(token, selectedAvailability._id, updatedAvailability);
      dispatch(fetchAvailabilities()); // Refresh the availabilities list after update
    } catch (error) {
      console.error('Error updating availability:', error);
    }
    handleClose();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  const handleSearchByChange = (searchBy) => {
    setSearchBy(searchBy);
    setCurrentPage(1); // Reset to the first page when the search by changes
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredAvailabilities = availabilities.filter((availability) =>
    availability[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAvailability = currentPage * availabilitiesPerPage;
  const indexOfFirstAvailability = indexOfLastAvailability - availabilitiesPerPage;
  const currentAvailabilities = filteredAvailabilities.slice(indexOfFirstAvailability, indexOfLastAvailability);

  const totalPages = Math.ceil(filteredAvailabilities.length / availabilitiesPerPage);

  return (
    <div>
      <InputGroup className="mb-3">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          title={`Search by ${searchBy}`}
          id="input-group-dropdown-1"
          onSelect={handleSearchByChange}
          style={{ width: '120px' }} // Adjust the width of the dropdown button
        >
          <Dropdown.Item eventKey="dayOfWeek">Day</Dropdown.Item>
          <Dropdown.Item eventKey="startTime">Start</Dropdown.Item>
          <Dropdown.Item eventKey="endTime">End</Dropdown.Item>
        </DropdownButton>
        <Form.Control
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={searchTerm}
          onChange={handleSearchChange}
          className="me-2"
        />
      </InputGroup>
      <Row>
        {currentAvailabilities.map((availability) => (
          <Col key={availability._id} xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{availability.dayOfWeek}</Card.Title>
                <Card.Text>
                  Start Time: {availability.startTime} <br />
                  End Time: {availability.endTime}
                </Card.Text>
                <Button variant="primary" onClick={() => handleUpdate(availability)}>
                  Update
                </Button>
                <Button
                  ref={target}
                  variant="danger"
                  onClick={() => handleDelete(availability._id)}
                  className="ml-2"
                >
                  Delete
                </Button>
                <Overlay target={target.current} show={showOverlay} placement="top">
                  {(props) => (
                    <Tooltip id="overlay-error" {...props}>
                      {deleteError}
                    </Tooltip>
                  )}
                </Overlay>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <nav>
        <ul className="pagination">
          {[...Array(totalPages).keys()].map((number) => (
            <li
              key={number + 1}
              className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}
            >
              <a onClick={() => paginate(number + 1)} href="#!" className="page-link">
                {number + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {selectedAvailability && (
        <AvailabilityModal
          show={showModal}
          handleClose={handleClose}
          handleSave={handleSave}
          day={selectedAvailability.dayOfWeek}
          start={selectedAvailability.startTime}
          end={selectedAvailability.endTime}
        />
      )}
    </div>
  );
};

export default ManageAvailability;