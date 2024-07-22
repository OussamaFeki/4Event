import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Event.css'; // Custom CSS for additional styling

const Event = () => {
  return (
    <div className="event-page">
      <div className="event-header">
        <h1>4 Event</h1>
      </div>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="mt-4 mb-4 text-center">
              4 event are packed full of market-leading speakers, discussing the latest trends and technologies impacting the market.
            </h2>
            <p>
              Topics range from: how to maintain audience attention and engagement; how to create compelling content; how to encourage diversity; talent and the new roles within events; how to choose the right platform; new technologies; how to price your virtual event; how is value perceived and measured at a virtual event and much more.
            </p>
            <p>
              4 event attract hundreds of leading industry professionals, providing an ideal platform to engage with your global community, whilst gaining market insight.
            </p>
            <p>
              Other topics for 2021 include Cyber Security, Start-ups and Pitches, Data and Measurement, Virtual & Hybrid Event Registration, How to Increase Audience Engagement and Interaction, The Role of Venues in Hybrid Events and much more.
            </p>
            <div className="text-center mt-4">
              <Button variant="danger" className="mx-2">Sponsor</Button>
              <Button variant="primary" className="mx-2">Speak</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Event;
