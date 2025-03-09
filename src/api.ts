import { LocalStorage } from './localstorage';

export interface ICalendarTask {
  taskId: number;
  name: string;
  date: Date;
  tag: string;
  status: 'new' | 'in progress' | 'done';
  text: string;
}

export interface ICalendarFilter {
  date?: Date;
  name?: string;
  tag?: string;
  status?: 'new' | 'in progress' | 'done';
  text?: string;
}

export interface IStorage {
  create: (task: ICalendarTask) => Promise<void>;
  read: () => Promise<ICalendarTask[]>;
  update: (task: ICalendarTask) => Promise<void>;
  delete: (task: ICalendarTask) => Promise<void>;
  filter: (
    filterOptionKey: Partial<ICalendarFilter>,
    filterOptionValue: Partial<ICalendarFilter>,
  ) => Promise<ICalendarTask[] | []>;
}

export class Calendar implements IStorage {
  type: 'LocalStorage';

  private storage: IStorage;

  private storeID: string = 'calendarTasks';

  constructor(type: 'LocalStorage') {
    this.type = type;
    this.storage = new LocalStorage(this.storeID);
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
  async filter(filterOptionKey, filterOptionValue) {
    return this.storage.filter(filterOptionKey, filterOptionValue);
  }
}
