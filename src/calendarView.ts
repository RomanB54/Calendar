import { ICalendarTask, ICalendarFilter } from './api';

export interface ICalendarView {
  el: HTMLElement;
  calendarFieldEl: HTMLElement;
  taskFieldEl: HTMLElement;
  taskFilterEl: HTMLElement;
  showCurrentMonthValue(m: number, y: number): void;
  showNextMonth(): void;
  showPrevMonth(): void;
  showMonth(m: number, y: number): void;
  onShowNextMonth(): void;
  onShowPrevMonth(): void;
  onCellClick(event: Event): void;
  createNewTask(cb: (task: ICalendarTask) => void): void;
  onCreateNewTask(element: HTMLElement): void;
  // updateTask(cb: (task: ICalendarTask) => void): void;
  // onUpdateTask(element: HTMLElement, taskId: string): void;
  getTaskPara(cb: (taskId: string) => ICalendarTask): void;
}

export class CalendarView implements ICalendarView {
  public el: HTMLElement;
  public calendarFieldEl: HTMLElement;
  public calendarHeaderEl: HTMLElement;
  public prevMonth: HTMLButtonElement;
  public monthYear: HTMLElement;
  public nextMonth: HTMLButtonElement;
  public weekdays: HTMLElement;
  public calendarDates: HTMLElement;
  public taskFieldEl: HTMLElement;
  public taskActionType: HTMLElement;
  public taskParameters: HTMLElement;
  public taskFilterEl: HTMLElement;
  public taskListEl: HTMLElement;
  public storageTypeEl: HTMLElement;
  public createNewTaskCallback(task: ICalendarTask): void {}
  public updateTaskCallback(task: ICalendarTask): void {}
  public getTaskParaCallback(taskId: string): void {};
  private daysOfWeek: string[];
  private monthOfYear: string[];
  private currentDate: Date;
  private currMonth: number = 0;
  private currYear: number = 0;
  private currDay: number = 0;

  constructor(el: HTMLElement) {
    this.el = el;
    this.taskFieldEl = document.createElement('div');
    this.taskFieldEl.setAttribute('class', 'taskField');
    this.el.appendChild(this.taskFieldEl);
    this.taskActionType = document.createElement('p');
    this.taskActionType.setAttribute('class', 'taskActionType');
    this.taskActionType.innerText = 'Filter task';
    this.taskFieldEl.appendChild(this.taskActionType);
    this.taskParameters = document.createElement('form');
    this.taskParameters.setAttribute('class', 'taskParameters');
    this.taskFieldEl.appendChild(this.taskParameters);
    this.calendarFieldEl = document.createElement('div');
    this.calendarFieldEl.setAttribute('class', 'calendarField');
    this.el.appendChild(this.calendarFieldEl);
    this.calendarHeaderEl = document.createElement('div');
    this.calendarHeaderEl.setAttribute('class', 'calendarHeader');
    this.calendarFieldEl.appendChild(this.calendarHeaderEl);
    this.prevMonth = document.createElement('button');
    this.prevMonth.textContent = '❮';
    this.prevMonth.setAttribute('class', 'prevMonth');
    this.prevMonth.addEventListener('click', this.onShowPrevMonth.bind(this));
    this.calendarHeaderEl.appendChild(this.prevMonth);
    this.monthYear = document.createElement('div');
    this.monthYear.setAttribute('class', 'monthYear');
    this.calendarHeaderEl.appendChild(this.monthYear);
    this.nextMonth = document.createElement('button');
    this.nextMonth.textContent = '❯';
    this.nextMonth.setAttribute('class', 'nextMonth');
    this.nextMonth.addEventListener('click', this.onShowNextMonth.bind(this));
    this.calendarHeaderEl.appendChild(this.nextMonth);
    this.weekdays = document.createElement('table');
    this.weekdays.setAttribute('class', 'weekdays');
    this.calendarFieldEl.appendChild(this.weekdays);
    this.calendarDates = document.createElement('table');
    this.calendarDates.setAttribute('class', 'calendarDates');
    this.calendarFieldEl.appendChild(this.calendarDates);
    this.taskFilterEl = document.createElement('div');
    this.taskFilterEl.setAttribute('class', 'taskFilter');
    this.el.appendChild(this.taskFilterEl);
    this.taskListEl = document.createElement('div');
    this.taskListEl.setAttribute('class', 'taskList');
    this.el.appendChild(this.taskListEl);
    this.storageTypeEl = document.createElement('div');
    this.storageTypeEl.setAttribute('class', 'storageType');
    this.el.appendChild(this.storageTypeEl);
    this.daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    this.monthOfYear = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.currentDate = new Date();
    if (this.currentDate) {
      this.currMonth = this.currentDate.getMonth();
      this.currYear = this.currentDate.getFullYear();
      this.currDay = this.currentDate.getDate();
      this.showCurrentMonthValue(this.currMonth, this.currYear);
      this.showMonth(this.currMonth, this.currYear);
    }
  }

  showCurrentMonthValue(m: number, y: number) {
    const monthYearField = document.querySelector('.monthYear');
    if (monthYearField) {
      monthYearField.innerHTML = '<p>' + this.monthOfYear[m] + ' ' + y + '</p>';
    }
  }
  showMonth(m: number, y: number): void {
    const date = new Date();
    const firstDayOfMonth = new Date(y, m, 7).getDay();
    const lastDateOfMonth = new Date(y, m + 1, 0).getDate();
    const lastDayOfLastMonth =
      m === 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
    const weekdaysTable = document.querySelector('.weekdays');
    let weekdaysTr = '';
    for (let i = 0; i < this.daysOfWeek.length; i++) {
      weekdaysTr += '<td>' + this.daysOfWeek[i] + '</td>';
    }
    if (weekdaysTable) {
      weekdaysTable.innerHTML =
        '<tr class="weekdaysName">' + weekdaysTr + '</tr>';
    }
    let monthDaysTable = '';
    for (let i = 1; i <= lastDateOfMonth; i++) {
      let dayOfWeekTemp = new Date(y, m, i).getDay();
      if (dayOfWeekTemp === 1) {
        monthDaysTable = monthDaysTable + '<tr>';
      } else if (i === 1) {
        monthDaysTable = monthDaysTable + '<tr>';
        let previousMonthDays = lastDayOfLastMonth - firstDayOfMonth + 1;
        for (let j = 0; j < firstDayOfMonth; j++) {
          monthDaysTable =
            monthDaysTable +
            '<td class="notCurrentMonth">' +
            previousMonthDays +
            '</td>';
          previousMonthDays++;
        }
      }
      const checkDate = new Date();
      const checkMonth = checkDate.getMonth();
      const checkYear = checkDate.getFullYear();
      let stringMonth = '';
      let stringDay = '';
      if (this.currMonth < 10) {
        stringMonth = '0' + (this.currMonth + 1).toString();
      } else {
        stringMonth = (this.currMonth + 1).toString();
      }
      if (i < 10) {
        stringDay = '0' + i.toString();
      } else {
        stringDay = i.toString();
      }
      if (
        i === this.currDay &&
        checkMonth === this.currMonth &&
        checkYear === this.currYear
      ) {
        monthDaysTable =
          monthDaysTable +
          '<td class ="normal today"' +
          ` id=${this.currYear}-${stringMonth}-${stringDay}>` +
          i +
          '</td>';
      } else {
        monthDaysTable =
          monthDaysTable +
          '<td class ="normal"' +
          ` id=${this.currYear}-${stringMonth}-${stringDay}>` +
          i +
          '</td>';
      }
      if (dayOfWeekTemp === 0) {
        monthDaysTable = monthDaysTable + '</tr>';
      } else if (i === lastDateOfMonth) {
        let nextMonthDays = 1;
        for (dayOfWeekTemp; dayOfWeekTemp < 7; dayOfWeekTemp++) {
          monthDaysTable =
            monthDaysTable +
            '<td class="notCurrentMonth">' +
            nextMonthDays +
            '</td>';
          nextMonthDays++;
        }
      }
    }
    const monthDays = document.querySelector('.calendarDates');
    if (monthDays) {
      monthDays.innerHTML = monthDaysTable;
    }
    const monthCell = document.querySelectorAll('.normal');
    monthCell.forEach((cell) =>
      cell.addEventListener('click', this.onCellClick.bind(this)),
    );
  }
  showNextMonth(): void {
    if (this.currMonth === 11) {
      this.currMonth = 0;
      this.currYear = this.currYear + 1;
    } else {
      this.currMonth = this.currMonth + 1;
    }
  }
  showPrevMonth(): void {
    if (this.currMonth === 0) {
      this.currMonth = 11;
      this.currYear = this.currYear - 1;
    } else {
      this.currMonth = this.currMonth - 1;
    }
  }
  onShowNextMonth(): void {
    this.showNextMonth();
    this.showMonth(this.currMonth, this.currYear);
    this.showCurrentMonthValue(this.currMonth, this.currYear);
  }
  onShowPrevMonth(): void {
    this.showPrevMonth();
    this.showMonth(this.currMonth, this.currYear);
    this.showCurrentMonthValue(this.currMonth, this.currYear);
  }
  onCellClick(event: Event): void {
    if (event.target) {
      if ((event.target as HTMLElement).classList.contains('taskEx')) {
        const taskId = (event.target as HTMLElement).id + '-1';
        const tempTask = this.getTaskParaCallback(taskId);
        console.log(tempTask);
        // this.onUpdateTask(event.target as HTMLElement);
      } else {
        this.onCreateNewTask(event.target as HTMLElement);
      }
    }
  }

  onCreateNewTask(element: HTMLElement): void {
    const tempTaskID = element.id + '-1';
    this.taskActionType.innerText = 'Create new Task';
    this.taskParameters.innerHTML = `
    <label for="taskId">Task ID:</label>
    <input type="text" id="taskId" name="taskId" value="${tempTaskID}" readonly><br><br>
    <label for="name">Task Name:</label>
    <input type="text" id="NewTaskName" name="name" value="new task1"><br><br>
<label for="date">Task Date:</label>
<input type="date" id="NewTaskDate" name="date" value="${element.id}"><br><br>
<label for="time">Task Time:</label>
<input type="time" id="NewTaskTime" name="time" value="00:00"><br><br>
    <label for="status">Task Status:</label>
    <select id="NewTaskStatus" name="status">
    <option value="in progress" selected>In Progress</option>
    <option value="completed">Completed</option>
    <option value="pending">Pending</option>
    </select><br><br>
    <label for="tag">Task Tag:</label>
     <select id="NewTaskTag" name="tag">
    <option value="personal" selected>Personal</option>
    <option value="work">Work</option>
    <option value="other">Other</option>
    </select><br><br>
    <label for="text">Task Description:</label>
    <textarea id="NewTaskText" name="text">work</textarea><br><br>
    <button class='saveNewTask'>Save</button>
    <button class='cancel'>Cancel</button>`;

    const saveNewTaskBtn: HTMLElement = document.querySelector('.saveNewTask')!;
    saveNewTaskBtn.addEventListener('click', () => {
      const taskIdInput = document.getElementById('taskId')!;
      const taskNameInput = document.getElementById('NewTaskName')!;
      const taskDateInput = (
        document.getElementById('NewTaskDate') as HTMLInputElement
      ).value;
      const taskTimeInput = (
        document.getElementById('NewTaskTime') as HTMLInputElement
      ).value;
      const taskStatusInput = document.getElementById('NewTaskStatus')!;
      const taskTagInput = document.getElementById('NewTaskTag')!;
      const taskTextInput = document.getElementById('NewTaskText')!;
      const taskId = taskIdInput && (taskIdInput as HTMLInputElement).value;
      const taskName =
        taskNameInput && (taskNameInput as HTMLInputElement).value;
      const taskDate = taskDateInput + ' ' + taskTimeInput;
      const taskStatus =
        taskStatusInput && (taskStatusInput as HTMLSelectElement).value;
      const taskTag = taskTagInput && (taskTagInput as HTMLSelectElement).value;
      const taskText =
        taskTextInput && (taskTextInput as HTMLTextAreaElement).value;
      const taskFormResult: ICalendarTask = {
        taskId: taskId,
        name: taskName,
        date: taskDate,
        status: taskStatus as 'new' | 'in progress' | 'done',
        tag: taskTag as 'Personal' | 'Work' | 'Other',
        text: taskText,
      };
      element.classList.add('taskEx');
      this.createNewTaskCallback(taskFormResult);
      this.taskParameters.innerHTML = '';
      this.taskActionType.innerText = 'Task Filter';
    });
  }
  createNewTask(cb: (task: ICalendarTask) => void) {
    this.createNewTaskCallback = cb;
  }

//   onUpdateTask(element: HTMLElement, task: ICalendarTask): void {
//     this.taskActionType.innerText = 'Update Task';
//     this.taskParameters.innerHTML = `
//     <label for="taskId">Task ID:</label>
//     <input type="text" id="taskId" name="taskId" value="${tempTaskID}" readonly><br><br>
//     <label for="name">Task Name:</label>
//     <input type="text" id="NewTaskName" name="name" value="new task1"><br><br>
// <label for="date">Task Date:</label>
// <input type="date" id="NewTaskDate" name="date" value="${element.id}"><br><br>
// <label for="time">Task Time:</label>
// <input type="time" id="NewTaskTime" name="time" value="00:00"><br><br>
//     <label for="status">Task Status:</label>
//     <select id="NewTaskStatus" name="status">
//     <option value="in progress" selected>In Progress</option>
//     <option value="completed">Completed</option>
//     <option value="pending">Pending</option>
//     </select><br><br>
//     <label for="tag">Task Tag:</label>
//      <select id="NewTaskTag" name="tag">
//     <option value="personal" selected>Personal</option>
//     <option value="work">Work</option>
//     <option value="other">Other</option>
//     </select><br><br>
//     <label for="text">Task Description:</label>
//     <textarea id="NewTaskText" name="text">work</textarea><br><br>
//     <button class='saveNewTask'>Save</button>
//     <button class='cancel'>Cancel</button>`;
//   }

//   updateTask(cb: (task: ICalendarTask) => ICalendarTask) {
//     this.updateTaskCallback = cb;
//   }

  getTaskPara(cb: (taskId: string) => void): void {
    this.getTaskParaCallback = cb; 
  }
}
