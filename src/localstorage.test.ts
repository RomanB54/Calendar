import { LocalStorage } from './localstorage';
import { ICalendarTask } from './api';

describe('LocalStorage', () => {
  const localId = 'calendarTasks';
  const storage = new LocalStorage(localId);
  const taskOne: ICalendarTask = {
    taskId: 1,
    name: 'new task1',
    date: Date.parse('2024-12-22 23:23:23'),
    status: 'in progress',
    tag: 'personal',
    text: 'work',
  };
  const taskTwo: ICalendarTask = {
    taskId: 1234567,
    name: 'new task2',
    date: Date.parse('2022-08-22 11:11:11'),
    status: 'in progress',
    tag: 'home',
    text: 'homework',
  };
  const taskThree: ICalendarTask = {
    taskId: 999999999999,
    name: 'new task3',
    date: Date.parse('2022-08-22'),
    status: 'new',
    tag: 'personel',
    text: 'homework 2',
  };

  const taskTest: ICalendarTask = {
    taskId: 1234567,
    name: 'updated task',
    date: Date.parse('2022-08-23'),
    status: 'done',
    tag: 'test',
    text: 'do my homework',
  };

  beforeAll(async () => {
    await storage.create(taskOne);
    await storage.create(taskTwo);
    await storage.create(taskThree);
  });

  it('should read data from localStorage', async () => {
    expect(await storage.read()).toStrictEqual([taskOne, taskTwo, taskThree]);
  });

  it('should update data in localStorage', async () => {
    await storage.update(taskTest);

    expect(await storage.read()).toStrictEqual([taskOne, taskTest, taskThree]);
  });

  it('should remove data from localStorage', async () => {
    await storage.delete(taskTest);

    expect(await storage.read()).toStrictEqual([taskOne, taskThree]);
  });

  it('should filter data by tag from localStorage', async () => {
    expect(await storage.filter('tag', 'personal')).toStrictEqual([taskOne]);
  });

  it('should filter data by status from localStorage', async () => {
    expect(await storage.filter('status', 'new')).toStrictEqual([taskThree]);
  });

  it('should filter data by description from localStorage', async () => {
    const temp = await storage.filter('description', 'do');
    console.log(temp);
    expect(await storage.filter('text', 'work')).toStrictEqual([taskOne]);
  });

  it('should filter data by date from localStorage', async () => {
    expect(
      await storage.filter('date', Date.parse('2024-12-22 23:23:23')),
    ).toStrictEqual([taskOne]);
  });
});
