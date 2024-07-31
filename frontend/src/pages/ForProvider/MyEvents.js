import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import Calendar from '../../components/forProvider/Calender';
import AvailabilityModal from '../../components/forProvider/AvailabilityModal';
import { fetchData, updateProviderAvailability } from '../../redux/actions/providerAction';

const MyEvents = () => {
  const dispatch = useDispatch();
  const { selfData, loading, error } = useSelector((state) => state.provider);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveAvailability = (newAvailability) => {
    dispatch(updateProviderAvailability(newAvailability)).then(() => {
      dispatch(fetchData()); // Re-fetch data after updating availability
    });
    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Ensure selfData is defined before accessing its properties
  const correctedAvailabilities = selfData?.availabilities?.map((availability) => ({
    ...availability,
    dayOfWeek: availability.dayOfWeek.toUpperCase(),
  })) || [];

  return (
    <div>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleShowModal}>
            Add Availability
          </Button>
        </Col>
      </Row>
      <Calendar events={selfData?.events || []} availability={correctedAvailabilities} />
      <AvailabilityModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveAvailability}
      />
    </div>
  );
};

export default MyEvents;
