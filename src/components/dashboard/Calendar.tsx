// Calendar.tsx
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {enUS} from 'date-fns/locale/en-US';
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function AuctionCalendar({ events }: { events: any[] }) {
      // Style events based on their type
  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad'; // default

    switch (event.type) {
      case 'start':
        backgroundColor = '#2196f3'; // blue
        break;
      case 'end':
        backgroundColor = '#f44336'; // red
        break;
      case 'active':
        backgroundColor = '#4caf50'; // green
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px',
      },
    };
  };
    return (
        <Calendar
            localizer={localizer}
            events={events}
            defaultView="week"
            step={30}
            selectable
            eventPropGetter={eventStyleGetter}
        />
    );
}
