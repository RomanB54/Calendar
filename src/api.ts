import { LocalStorage } from './localstorage';
import { FireStore } from './firestore';
export interface ICalendarTask {
  taskId: string;
  name: string;
  date: string;
  tag: string;
  status: 'new' | 'in progress' | 'done';
  text: string;
}

export interface ICalendarFilter {
  taskId?: string;
  date?: string;
  name?: string;
  tag?: string;
  status?: 'new' | 'in progress' | 'done';
  text?: string;
}
export enum STORAGES {
  localStorage = 'LocalStorage',
  fireStore = 'FireStore',
}
export interface ICalendarStorage {
  type: STORAGES;
}

export interface IStorage {
  create: (task: ICalendarTask) => Promise<void>;
  read: () => Promise<ICalendarTask[]>;
  update: (task: ICalendarTask) => Promise<void>;
  delete: (task: ICalendarTask) => Promise<void>;
  filter: (
    filterOptionKey: keyof ICalendarFilter,
    filterOptionValue: ICalendarFilter[keyof ICalendarFilter],
  ) => Promise<ICalendarTask[] | []>;
  getOneTask: (taskId: string) => Promise<ICalendarTask>;
}

export class CalendarAPI implements IStorage, ICalendarStorage {
  readonly type: STORAGES;
  private storage: IStorage;

  private storeID: string = 'calendarTasks';

  constructor(type: STORAGES) {
    this.type = type;
    this.storage =
      type === STORAGES.localStorage
        ? new LocalStorage(this.storeID)
        : new FireStore(this.storeID);
  }

  async create(task: ICalendarTask) {
    return this.storage.create(task);
  }
  async read() {
    return this.storage.read();
  }
  async update(task: ICalendarTask) {
    return this.storage.update(task);
  }
  async delete(task: ICalendarTask) {
    return this.storage.delete(task);
  }
  async filter(
    filterOptionKey: keyof ICalendarFilter,
    filterOptionValue: ICalendarFilter[keyof ICalendarFilter],
  ) {
    return this.storage.filter(filterOptionKey, filterOptionValue);
  }
  async getOneTask(taskId: string) {
    return this.storage.getOneTask(taskId);
  }
}
