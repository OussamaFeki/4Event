import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import './Calendar.css';

const Calendar = ({ events, availability, requests, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const invalidTimeSlots = generateInvalidTimeSlots(availability);
  const availableSlots = generateAvailableSlots(availability, events);
  console.log(availableSlots);

  const formattedEvents = events.map(event => ({
    title: event.name,
    start: `${event.date.split('T')[0]}T${event.startTime}`,
    end: `${event.date.split('T')[0]}T${event.endTime}`
  }));

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.title === '+') {
      setSelectedSlot({
        start: clickInfo.event.start,
        end: clickInfo.event.end
      });
      setShowModal(true);
    }
  };

  return (
<Container fluid>
      <Row>
        <Col>
          <div style={{ height: '600px', width: '100%' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, momentTimezonePlugin, interactionPlugin]}
              initialView="timeGridWeek"
              timeZone="local"
              events={[...formattedEvents, ...invalidTimeSlots, ...availableSlots]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: ''
              }}
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              businessHours={availability.map(slot => ({
                daysOfWeek: [dayOfWeekEnumToNumber(slot.dayOfWeek)],
                startTime: slot.startTime,
                endTime: slot.endTime
              }))}
              selectConstraint="businessHours"
              selectMirror={true}
              selectable={true}
              nowIndicator={true}
              eventContent={eventInfo => renderEventContent(eventInfo)}
              allDaySlot={false}
              eventClick={handleEventClick}
            />
          </div>
        </Col>
      </Row>
      <BookingModal
        show={showModal}
        onHide={() => setShowModal(false)}
        selectedSlot={selectedSlot}
        userId={userId}
      />
    </Container>
  );
};

const dayOfWeekEnumToNumber = (dayOfWeek) => {
  switch (dayOfWeek) {
    case 'SUNDAY': return 0;
    case 'MONDAY': return 1;
    case 'TUESDAY': return 2;
    case 'WEDNESDAY': return 3;
    case 'THURSDAY': return 4;
    case 'FRIDAY': return 5;
    case 'SATURDAY': return 6;
    default: return -1;
  }
};

const generateInvalidTimeSlots = (availability) => {
  const invalidTimeSlots = [];
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // All days of the week

  daysOfWeek.forEach((day) => {
    const dayAvailability = availability.filter(slot => dayOfWeekEnumToNumber(slot.dayOfWeek.toUpperCase()) === day);

    if (dayAvailability.length === 0) {
      // If no availability for this day, mark the whole day as invalid
      invalidTimeSlots.push({
        title: 'Invalid',
        daysOfWeek: [day],
        startTime: '00:00',
        endTime: '24:00',
        display: 'background',
        backgroundColor: 'rgba(255, 0, 0)',
        textColor: 'black' // Black text color for Invalid
      });
    } else {
      // Sort availability slots for this day
      dayAvailability.sort((a, b) => a.startTime.localeCompare(b.startTime));

      // Add invalid slot before first available slot if needed
      if (dayAvailability[0].startTime !== '00:00') {
        invalidTimeSlots.push({
          title: 'Invalid',
          daysOfWeek: [day],
          startTime: '00:00',
          endTime: dayAvailability[0].startTime,
          display: 'background',
          backgroundColor: 'rgba(255, 0, 0)',
          textColor: 'black' // Black text color for Invalid
        });
      }

      // Add invalid slots between available slots
      for (let i = 0; i < dayAvailability.length - 1; i++) {
        invalidTimeSlots.push({
          title: 'Invalid',
          daysOfWeek: [day],
          startTime: dayAvailability[i].endTime,
          endTime: dayAvailability[i + 1].startTime,
          display: 'background',
          backgroundColor: 'rgba(255, 0, 0)',
          textColor: 'black' // Black text color for Invalid
        });
      }

      // Add invalid slot after last available slot if needed
      const lastSlot = dayAvailability[dayAvailability.length - 1];
      if (lastSlot.endTime !== '24:00') {
        invalidTimeSlots.push({
          title: 'Invalid',
          daysOfWeek: [day],
          startTime: lastSlot.endTime,
          endTime: '24:00',
          display: 'background',
          backgroundColor: 'rgba(255, 0, 0)',
          textColor: 'black' // Black text color for Invalid
        });
      }
    }
  });

  return invalidTimeSlots;
};

const generateAvailableSlots = (availability, events = []) => {
  const availableSlots = [];
  const eventsByDate = {};

  // Organize events by date for easy lookup
  events.forEach(event => {
    const date = event.date.split('T')[0];
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });

  // Iterate over each availability slot
  availability.forEach(slot => {
    const dayOfWeek = dayOfWeekEnumToNumber(slot.dayOfWeek.toUpperCase());

    // Iterate over a range of dates to cover multiple weeks
    for (let dayOffset = 0; dayOffset < 1400; dayOffset++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + dayOffset);

      // Check if the current date matches the availability day of the week
      if (currentDate.getUTCDay() === dayOfWeek) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        const dayEvents = eventsByDate[formattedDate] || [];

        // Convert availability slot to date objects for comparison
        let slotStart = new Date(`${formattedDate}T${slot.startTime}:00`);
        const slotEnd = new Date(`${formattedDate}T${slot.endTime}:00`);

        // If no events on this date, add the entire availability slot
        if (dayEvents.length === 0) {
          availableSlots.push({
            title: '+',
            start: `${formattedDate}T${slot.startTime}`,
            end: `${formattedDate}T${slot.endTime}`,
            display: 'background',
            backgroundColor: 'rgba(0, 128, 0, 0.5)', // Darker green color
            extendedProps: { clickable: true }
          });
        } else {
          // Process each event to adjust availability slots
          dayEvents.forEach(event => {
            const eventStart = new Date(`${formattedDate}T${event.startTime}:00`);
            const eventEnd = new Date(`${formattedDate}T${event.endTime}:00`);

            // If event starts before the slot and ends after the start of the slot, adjust the slot start
            if (eventStart <= slotStart && eventEnd > slotStart) {
              slotStart = eventEnd;
            }

            // If event starts after the slot start and before the slot end, create a new available slot and adjust the slot start
            if (eventStart > slotStart && eventStart < slotEnd) {
              availableSlots.push({
                title: '+',
                start: `${formattedDate}T${slotStart.toTimeString().slice(0, 5)}`,
                end: `${formattedDate}T${eventStart.toTimeString().slice(0, 5)}`,
                display: 'background',
                backgroundColor: 'rgba(0, 128, 0, 0.5)', // Darker green color
                extendedProps: { clickable: true }
              });
              slotStart = eventEnd;
            }
          });

          // Add the remaining slot if it is still valid
          if (slotStart < slotEnd) {
            availableSlots.push({
              title: '+',
              start: `${formattedDate}T${slotStart.toTimeString().slice(0, 5)}`,
              end: `${formattedDate}T${slotEnd.toTimeString().slice(0, 5)}`,
              display: 'background',
              backgroundColor: 'rgba(0, 128, 0, 0.5)', // Darker green color
              extendedProps: { clickable: true }
            });
          }
        }
      }
    }
  });

  return availableSlots;
};


function renderEventContent(eventInfo) {
  const isInvalid = eventInfo.event.title === 'Invalid';
  const isAvailable = eventInfo.event.title === '+';

  return (
    <>
      {isAvailable ? (
        <div 
          style={{ 
            backgroundColor: 'rgba(0, 128, 0, 0.5)', 
            height: '100%', 
            width: '100%', 
            textAlign: 'center', 
            lineHeight: '2',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PlusCircle color="white" size={20} />
        </div>
      ) : (
        <i style={{ color: isInvalid ? 'black' : 'inherit' }}>{eventInfo.event.title}</i>
      )}
      <br />
      <b>{eventInfo.timeText}</b>
    </>
  );
}

const BookingModal = ({ show, onHide, selectedSlot, userId }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book this slot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedSlot && (
          <>
            <p>Start: {selectedSlot.start.toLocaleString()}</p>
            <p>End: {selectedSlot.end.toLocaleString()}</p>
            <p>User ID: {userId}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {
          // Add your booking logic here
          console.log('Booking slot:', selectedSlot);
          onHide();
        }}>
          Book
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    })
  ).isRequired,
  availability: PropTypes.arrayOf(
    PropTypes.shape({
      dayOfWeek: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    })
  ).isRequired,
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      organizer: PropTypes.string.isRequired,
    })
  ),
  userId: PropTypes.string.isRequired
};

export default Calendar;
