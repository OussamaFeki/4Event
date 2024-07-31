import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailabilities } from '../../redux/actions/providerAction';


const ManageAvailability = () => {
  const dispatch = useDispatch();
  const { availabilities, loading, error } = useSelector((state) => state.provider); // Adjust according to your state structure
  const [currentPage, setCurrentPage] = useState(1);
  const availabilitiesPerPage = 5;

  useEffect(() => {
    dispatch(fetchAvailabilities());
  }, [dispatch]);

  const handleDelete = (id) => {
    // dispatch(deleteAvailability(id));
  };

  const handleUpdate = (id) => {
    // Add your update logic here
    // dispatch(updateAvailability(id));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const indexOfLastAvailability = currentPage * availabilitiesPerPage;
  const indexOfFirstAvailability = indexOfLastAvailability - availabilitiesPerPage;
  const currentAvailabilities = availabilities.slice(indexOfFirstAvailability, indexOfLastAvailability);

  return (
    <div>
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
                <Button variant="primary" onClick={() => handleUpdate(availability._id)}>
                  Update
                </Button>
                <Button variant="danger" onClick={() => handleDelete(availability._id)} className="ml-2">
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        availabilitiesPerPage={availabilitiesPerPage}
        totalAvailabilities={availabilities.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ availabilitiesPerPage, totalAvailabilities, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAvailabilities / availabilitiesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ManageAvailability;

