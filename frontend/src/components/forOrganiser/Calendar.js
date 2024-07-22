import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Calendar.css';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
  '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
  '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAllHours, setShowAllHours] = useState(false);
  const [events, setEvents] = useState([
    { name: 'Team Standup', date: new Date(2024, 6, 8), startTime: '10:00', endTime: '11:00', organizer: 'userId1', providers: ['providerId1'], requests: ['providerId2'], payment: 'paymentId1' },
    { name: 'Standup', date: new Date(2024, 6, 9), startTime: '11:00', endTime: '12:00', organizer: 'userId2', providers: ['providerId3'], requests: ['providerId4'], payment: 'paymentId2' },
    { name: 'Design session', date: new Date(2024, 6, 10), startTime: '14:00', endTime: '16:00', organizer: 'userId3', providers: ['providerId5'], requests: ['providerId6'], payment: 'paymentId3' }
  ]);

  const [availability, setAvailability] = useState([
    { dayOfWeek: 'Mon', startTime: '09:00', endTime: '17:00', provider: 'providerId1' },
    { dayOfWeek: 'Tue', startTime: '10:00', endTime: '18:00', provider: 'providerId2' },
    { dayOfWeek: 'Wed', startTime: '11:00', endTime: '19:00', provider: 'providerId3' }
  ]);

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(new Date(startOfWeek));
      startOfWeek.setDate(startOfWeek.getDate() + 1);
    }
    return weekDates;
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const toggleShowHours = () => {
    setShowAllHours(!showAllHours);
  };

  const weekDates = getWeekDates(new Date(currentWeek));

  const getEventDuration = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return duration;
  };

  const checkAvailability = (day, hour) => {
    const currentDayAvailability = availability.filter(slot => slot.dayOfWeek === day);
    return currentDayAvailability.some(slot => {
      const startTime = parseInt(slot.startTime.split(':')[0], 10);
      const endTime = parseInt(slot.endTime.split(':')[0], 10);
      return startTime <= hour && hour < endTime;
    });
  };

  const getEvent = (day, hour) => {
    return events.find(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0], 10);
      const eventEndHour = parseInt(event.endTime.split(':')[0], 10);
      return eventDate.toDateString() === day.toDateString() && eventStartHour <= hour && hour < eventEndHour;
    });
  };

  const renderEvent = (event, hourIndex) => {
    const [eventStartHour, eventStartMinute] = event.startTime.split(':').map(Number);
    const eventDuration = getEventDuration(event.startTime, event.endTime);
    return (
      <div
        className="event"
        style={{
          top: `${(eventStartHour * 60 + eventStartMinute - hourIndex * 60) * 50 / 60}px`,
          height: `${eventDuration * 50 / 60}px`,
          backgroundColor: '#9ACD32',
          border: '1px solid #9ACD32',
          borderRadius: '5px',
          position: 'absolute',
          width: '100%'
        }}
      >
        {event.name}
      </div>
    );
  };

  return (
    <Container className="calendar-container">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <Button variant="secondary" onClick={previousWeek}>Previous Week</Button>
          <h2 className="text-light">{`Week of ${weekDates[0].toLocaleDateString()}`}</h2>
          <Button variant="secondary" onClick={nextWeek}>Next Week</Button>
        </Col>
      </Row>
      <Row className="days-header">
        {daysOfWeek.map((day, index) => (
          <Col key={index} className="day-name">
            <div>{day}</div>
            <div>{weekDates[index].toLocaleDateString()}</div>
          </Col>
        ))}
      </Row>
      <Row className="hours">
        <Col className="time-column">
          {hours.slice(0, showAllHours ? hours.length : 12).map((hour, index) => (
            <div key={index} className="hour-label">{hour}</div>
          ))}
        </Col>
        {weekDates.map((day, index) => (
          <Col key={index} className="day-column">
            {hours.slice(0, showAllHours ? hours.length : 12).map((hour, hourIndex) => {
              const event = getEvent(day, hourIndex);
              const isAvailable = checkAvailability(daysOfWeek[index], hourIndex);
              return (
                <div key={hourIndex} className="time-slot" style={{ position: 'relative', height: '50px', overflow: 'hidden' }}>
                  {event && parseInt(event.startTime.split(':')[0], 10) === hourIndex ? (
                    renderEvent(event, hourIndex)
                  ) : (
                    !isAvailable && (
                      <div className="availability" style={{ backgroundColor: 'grey', border: '1px solid grey', height: '100%' }}>
                        Not Available
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </Col>
        ))}
      </Row>
      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={toggleShowHours}>
            {showAllHours ? 'See Less' : 'See More'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Calendar;

