import { CalendarAPI, ICalendarTask, STORAGES } from './api';
import { Calendar } from './calendar';
import { CalendarView } from './calendarView';
import './styles.css';

const app = document.querySelector('#app') as HTMLElement;
const calendarView = new CalendarView(app);
new Calendar(calendarView, STORAGES.fireStore);
