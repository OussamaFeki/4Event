import React from 'react';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import './Calendar.css';

const Calendar = ({ events, availability, request, forOrganiser = false }) => {
  console.log('forOrganiser:', forOrganiser); // Debug log

  const invalidTimeSlots = generateInvalidTimeSlots(availability);
  const requestEvent = forOrganiser && request ? [{
    title: 'Wait for response',
    start: request.start,
    end: request.end,
    display: 'background',
    backgroundColor: 'rgba(255, 255, 0)' // Yellow color
  }] : [];

  const formattedEvents = events.map(event => ({
    title: event.name,
    start: `${event.date.split('T')[0]}T${event.startTime}`,
    end: `${event.date.split('T')[0]}T${event.endTime}`
  }));

  const availabilitySlots = forOrganiser ? generateAvailabilitySlots(availability) : [];

  console.log('formattedEvents:', formattedEvents); // Debug log
  console.log('availabilitySlots:', availabilitySlots); // Debug log

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, momentTimezonePlugin, interactionPlugin]}
        initialView="timeGridWeek"
        timeZone="local"
        events={[...formattedEvents, ...invalidTimeSlots, ...requestEvent, ...availabilitySlots]}
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
        eventContent={eventInfo => renderEventContent(eventInfo, forOrganiser)}
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

    if (dayAvailability.length === 0) {
      // If no availability for this day, mark the whole day as invalid
      invalidTimeSlots.push({
        title: 'Invalid',
        daysOfWeek: [day],
        startTime: '00:00',
        endTime: '24:00',
        display: 'background',
        backgroundColor: 'rgba(255, 0, 0)'
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
          backgroundColor: 'rgba(255, 0, 0)'
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
          backgroundColor: 'rgba(255, 0, 0)'
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
          backgroundColor: 'rgba(255, 0, 0)'
        });
      }
    }
  });

  return invalidTimeSlots;
};

const generateAvailabilitySlots = (availability) => {
  const availabilitySlots = [];

  availability.forEach(slot => {
    const daysOfWeek = [dayOfWeekEnumToNumber(slot.dayOfWeek)];
    availabilitySlots.push({
      title: '+',
      daysOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      display: 'background',
      backgroundColor: 'rgba(0, 255, 0, 0.5)' // Green color
    });
  });

  return availabilitySlots;
};

function renderEventContent(eventInfo, forOrganiser) {
  const isPlusSymbol = forOrganiser && eventInfo.event.title === '+';

  return (
    <>
      {isPlusSymbol ? <i>+</i> : <i>{eventInfo.event.title}</i>}<br />
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
  request: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }),
  forOrganiser: PropTypes.bool
};

export default Calendar;
