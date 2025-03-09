import { Calendar, ICalendarTask, STORAGES } from './api';

const tempCal = new Calendar(STORAGES.fireStore);

const taskOne: ICalendarTask = {
  taskId: 'task1',
  name: 'new task1',
  date: '2024-12-22 23:23:23',
  status: 'in progress',
  tag: 'personal',
  text: 'work',
};
const taskTwo: ICalendarTask = {
  taskId: 'task2',
  name: 'new task2',
  date: '2024-12-23 23:23:23',
  status: 'in progress',
  tag: 'personal',
  text: 'work',
};
const taskThree: ICalendarTask = {
  taskId: 'task3',
  name: 'new task2',
  date: '2024-12-23 23:23:23',
  status: 'in progress',
  tag: 'personal',
  text: 'work',
};

tempCal.create(taskOne);
const consLog = tempCal.read();
taskOne.name = 'updated task1';
tempCal.update(taskOne);
console.log('it is');
console.log(consLog);

tempCal.delete(taskOne);
tempCal.create(taskTwo);
taskTwo.name = 'updated task2';
tempCal.update(taskTwo);
tempCal.create(taskThree);
const filteredTasks = tempCal.filter('status', 'in progress');
console.log(filteredTasks);
