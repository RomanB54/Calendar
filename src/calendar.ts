import { CalendarView, ICalendarView } from './calendarView';
import { CalendarAPI, ICalendarTask, ICalendarFilter, STORAGES } from './api';

export interface ICalendar {
  bindCreateNewTaskEventCallbacks(): void;
}
export class Calendar implements ICalendar {
  private calendarView: CalendarView;
  private calendarAPI: CalendarAPI;

  constructor(calendarView: CalendarView, storageType: STORAGES) {
    this.calendarView = calendarView;
    this.calendarAPI = new CalendarAPI(storageType);
    this.bindCreateNewTaskEventCallbacks();
  }

  bindCreateNewTaskEventCallbacks(): void {
    this.calendarView.createNewTask(async (task: ICalendarTask) => {
      try {
        await this.calendarAPI.create(task);
        // this.refreshTaskList();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    });
  }
}
