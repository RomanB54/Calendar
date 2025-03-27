import { CalendarAPI, STORAGES } from './api';
import './styles.css';

const app = document.querySelector('#app') as HTMLElement;
const storage = new CalendarAPI(STORAGES.fireStore);
