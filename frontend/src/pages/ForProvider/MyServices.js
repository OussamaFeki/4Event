import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../../redux/actions/providerAction'; // Action to fetch services
import ServiceModal from '../../components/forProvider/ServiceModal';
import { createService, deleteService, updateService } from '../../services/providerServices';

const MyServices = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.provider); // Adjust according to your state structure
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const servicesPerPage = 3;

  useEffect(() => {
    dispatch(fetchServices());
  }, []);

  const handleDelete = async(id) => {
    const token = localStorage.getItem('token');
    try{
      await deleteService(token,id)
      dispatch(fetchServices());
    }catch{
      console.log("error")
    }
    
    // Uncomment when delete service action is implemented
  };

  const handleUpdate = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleSave = async (serviceData) => {
    const token = localStorage.getItem('token'); // Adjust based on your token storage method
    try {
      if (selectedService) {
        // If selectedService is not null, update the existing service
        console.log(selectedService._id)
        await updateService(token, selectedService._id, serviceData);
      } else {
        // Otherwise, create a new service
        await createService(token, serviceData);
      }
      dispatch(fetchServices()); // Refresh the services list after creation or update
    } catch (error) {
      console.error('Error saving service:', error);
    }
    handleClose();
  };

  const handleAddService = () => {
    setSelectedService(null);
    setShowModal(true);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h4>My Services</h4>
        </Col>
        <Col className="text-right">
          <Button variant="success" onClick={handleAddService}>
            Add Service
          </Button>
        </Col>
      </Row>

      {services.length === 0 ? (
        <Alert variant="info">There are no services.</Alert>
      ) : (
        <>
          <Row>
            {currentServices.map((service) => (
              <Col key={service._id} xs={12} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{service.name}</Card.Title>
                    <Card.Text>
                      Description: {service.description} <br />
                      Price: {service.price}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleUpdate(service)}>
                      Update
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(service._id)} className="ml-2">
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            servicesPerPage={servicesPerPage}
            totalServices={services.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}

      <ServiceModal
        show={showModal}
        handleClose={handleClose}
        handleSave={handleSave}
        name={selectedService?.name || ''}
        description={selectedService?.description || ''}
        price={selectedService?.price || ''}
      />
    </div>
  );
};

const Pagination = ({ servicesPerPage, totalServices, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalServices / servicesPerPage); i++) {
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

export default MyServices;
