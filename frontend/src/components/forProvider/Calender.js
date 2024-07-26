import React from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import './Calendar.css';

const Calendar = ({ events, availability, requests, userId }) => {
  const invalidTimeSlots = generateInvalidTimeSlots(availability);
  
  const formattedEvents = events.map(event => ({
    title: event.name,
    start: `${event.date.split('T')[0]}T${event.startTime}`,
    end: `${event.date.split('T')[0]}T${event.endTime}`
  }));

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, momentTimezonePlugin, interactionPlugin]}
        initialView="timeGridWeek"
        timeZone="local"
        events={[...formattedEvents, ...invalidTimeSlots]}
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
      />
    </div>
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
    const dayAvailability = availability.filter(slot => dayOfWeekEnumToNumber(slot.dayOfWeek) === day);
    console.log(dayAvailability)
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

function renderEventContent(eventInfo) {
  const isInvalid = eventInfo.event.title === 'Invalid';

  return (
    <>
      <i style={{ color: isInvalid ? 'black' : 'inherit' }}>{eventInfo.event.title}</i>
      <br />
      <b>{eventInfo.timeText}</b>
    </>
  );
}

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
      dayOfWeek: PropTypes.oneOf(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']).isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    })
  ).isRequired,
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      organizer: PropTypes.string.isRequired, // Ensure the requests have an organizer property
    })
  ),
  userId: PropTypes.string.isRequired // Add userId prop type
};

export default Calendar;
