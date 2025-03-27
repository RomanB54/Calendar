import { CalendarAPI, STORAGES } from './api';
import { Calendar } from './calendar';
import './styles.css';

const app = document.querySelector('#app') as HTMLElement;
const storage = new CalendarAPI(STORAGES.fireStore);
new Calendar(app, {
  readTasks: storage.read.bind(storage),
  createNewTask: storage.create.bind(storage),
  updateTask: storage.update.bind(storage),
  deleteTask: storage.delete.bind(storage),
  filterTasks: storage.filter.bind(storage),
  getTask: storage.getOneTask.bind(storage),
});
