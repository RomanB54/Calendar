import { IStorage, ICalendarTask, ICalendarFilter } from './api';

export class LocalStorage implements IStorage {
  private storeID: string = 'calendarTasks';
  private localStorage = localStorage;

  constructor(dataDB: string) {
    this.storeID = dataDB;
  }

  async create(task: ICalendarTask) {
    const tempArr: ICalendarTask[] = await this.read();
    tempArr.push(task);
    this.localStorage.setItem(this.storeID, JSON.stringify(tempArr));
  }

  async read() {
    const tempData = this.localStorage.getItem(this.storeID);
    if (tempData) {
      return JSON.parse(tempData);
    } else {
      return [];
    }
  }
  async update(task: ICalendarTask) {
    const tempData: ICalendarTask[] = await this.read();
    const newData = tempData.map((item) =>
      task.taskId === item.taskId ? task : item,
    );
    return localStorage.setItem(this.storeID, JSON.stringify(newData));
  }
  async delete(task: ICalendarTask) {
    const tempData: ICalendarTask[] = await this.read();
    for (let i = 0; i < tempData.length; i++) {
      if (task.taskId === tempData[i].taskId) {
        tempData.splice(i, 1);
      }
    }
    return localStorage.setItem(this.storeID, JSON.stringify(tempData));
  }
  async filter(
    filterOptionKey: keyof ICalendarFilter,
    filterOptionValue: ICalendarFilter[keyof ICalendarFilter],
  ) {
    const taskList: ICalendarTask[] = await this.read();
    if (filterOptionKey && filterOptionValue) {
      return taskList.filter(
        (task) => task[filterOptionKey] === filterOptionValue,
      );
    }
    return [];
  }
}
