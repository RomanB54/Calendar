'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const api_1 = require('./api');
const tempCal = new api_1.Calendar(api_1.STORAGES.fireStore);
const taskOne = {
  taskId: 'task1',
  name: 'new task1',
  date: '2024-12-22 23:23:23',
  status: 'in progress',
  tag: 'personal',
  text: 'work',
};
const taskTwo = {
  taskId: 'task2',
  name: 'new task2',
  date: '2024-12-23 23:23:23',
  status: 'in progress',
  tag: 'personal',
  text: 'work',
};
const taskThree = {
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
