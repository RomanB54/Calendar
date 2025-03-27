import { ICalendarTask, ICalendarFilter } from './api';

export interface ICalendar {
  el: HTMLElement;
  showCurrentMonthValue(m: number, y: number): void;
  showNextMonth(): void;
  showPrevMonth(): void;
  showMonth(m: number, y: number): void;
  onShowNextMonth(): void;
  onShowPrevMonth(): void;
  onCalendarDateClick(event: Event): void;
  createNewTaskView(element: HTMLElement): void;
  showTaskOnCell(task: ICalendarTask): void;
  getTaskParametersFromForm(element: HTMLAllCollection): ICalendarTask;
  viewRenderForMonthTasks(date: string): Promise<void>;
  showFilterMenu(m: number, y: number): void;
}

export class Calendar implements ICalendar {
  public el: HTMLElement;
  private daysOfWeek: string[];
  private monthOfYear: string[];
  private currentDate: Date;
  private currMonth: number = 0;
  private currYear: number = 0;
  private currDay: number = 0;
  private taskActionType: HTMLElement;
  private taskParameters: HTMLElement;
  private taskListView: HTMLElement;
  private taskFilterView: HTMLElement;

  constructor(
    el: HTMLElement,
    private api: {
      getTask: (taskIdForSearch: string) => Promise<ICalendarTask>;
      createNewTask: (task: ICalendarTask) => Promise<void>;
      updateTask: (task: ICalendarTask) => Promise<void>;
      readTasks: () => Promise<ICalendarTask[]>;
      deleteTask: (task: ICalendarTask) => Promise<void>;
      filterTasks: (
        filterOptionKey: keyof ICalendarFilter,
        filterOptionValue: ICalendarFilter[keyof ICalendarFilter],
      ) => Promise<ICalendarTask[] | []>;
    },
  ) {
    this.el = el;
    el.innerHTML = `
    <div class="task-filter-and-list">
    <div class="task-filter-view">
    </div>
    <div class="task-list-paragraph">
    <p class="task-list-view">Task View</p>
    <div class="task-list-box">
    </div>
    </div>
    </div>
    <div class="calendar-field">
      <div class="calendar-header">
      <button class="prev-month">❮</button>
        <div class="month-year">
        </div>
        <button class="next-month">❯</button>
      </div>
      <table class="weekdays"></table>
      <table class="calendar-dates"></table>
    </div>
    <div class="task-field">
      <p class="task-action-type">Operate task</p>
      <form class="task-parameters">
      </form>
    </div>`;
    const prevMonth = el.querySelector('.prev-month');
    const nextMonth = el.querySelector('.next-month');
    this.taskActionType = el.querySelector('.task-action-type')!;
    this.taskParameters = el.querySelector('.task-parameters')!;
    this.taskListView = el.querySelector('.task-list-box')!;
    this.taskFilterView = el.querySelector('.task-filter-view')!;

    if (prevMonth) {
      prevMonth.addEventListener('click', () => this.onShowPrevMonth());
    }
    if (nextMonth) {
      nextMonth.addEventListener('click', () => this.onShowNextMonth());
    }
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
      this.showFilterMenu(this.currMonth, this.currYear);
    }
  }

  showFilterMenu(m: number, y: number) {
    this.taskFilterView.innerHTML = `  <p class="task-list-view">Task Filter</p>
     <label for="task-filter-para">Filter type:</label>
     <select id="task-filter-para" name="FilterType">
     <option value="name">Task Name</option>
     <option value="date">Task Date</option>
     <option value="tag">Task Tag</option>
     <option value="status">Task Status</option>
     <option value="text">Task Text</option>
     </select><br><br>
     <div class="input-filter-value">
      <label for="input-data-filter">Filter value:</label>
     <input type="text" id="input-data-filter" name="InputFilterPara" value="new task1"><br><br>
     </div>
     <button class='apply-filter'>Apply</button>
     <button class="cancel-filter">Cancel</button>`;
    const filteredTaskId = [];
    let stringMonth;
    if (this.currMonth < 10) {
      stringMonth = '0' + (this.currMonth + 1).toString();
    } else {
      stringMonth = (this.currMonth + 1).toString();
    }
    const applyFilterBtn = this.taskFilterView.querySelector('.apply-filter');
    const cancelFilterBtn = this.taskFilterView.querySelector('.cancel-filter');
    applyFilterBtn?.addEventListener('click', async () => {
      const filterValueElement = this.taskFilterView.querySelector(
        '#input-data-filter',
      ) as HTMLInputElement;
      const filterValue =
        filterValueElement.value as ICalendarFilter[keyof ICalendarFilter];
      const filterKeyName = (
        this.taskFilterView.querySelector(
          '#task-filter-para',
        ) as HTMLSelectElement
      ).value as keyof ICalendarFilter;
      const tdTaskEx = document.querySelectorAll('.task-ex');
      const filteredTasks = await this.api.filterTasks(
        filterKeyName,
        filterValue,
      );
      this.taskListView.innerHTML = '';
      if (filteredTasks && filteredTasks.length > 0) {
        filteredTasks.forEach((task) => {
          const conditionToCheck = `${y}-${stringMonth}`;
          if (task.taskId.includes(conditionToCheck)) {
            this.taskListView.innerHTML += this.updateTaskListView(task);
          }
          tdTaskEx.forEach((date) => {
            if (task.taskId.includes(date.id)) {
              date.classList.add('task-filtered');
            }
          });
        });
      } else {
        this.taskListView.innerHTML =
          '<p>No tasks found matching the filter.</p>';
      }
    });
    cancelFilterBtn?.addEventListener('click', () => {
      this.viewRenderForMonthTasks(`${this.currYear}-${stringMonth}`);
      const tdTaskFiltered = document.querySelectorAll('.task-filtered');
      tdTaskFiltered.forEach((cell) => cell.classList.remove('task-filtered'));
    });
  }

  showCurrentMonthValue(m: number, y: number) {
    const monthYearField = document.querySelector('.month-year');
    if (monthYearField) {
      monthYearField.innerHTML = `<p>${this.monthOfYear[m]} ${y}</p>`;
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
      weekdaysTr += `<td>${this.daysOfWeek[i]}</td>`;
    }
    if (weekdaysTable) {
      weekdaysTable.innerHTML = `<tr class="weekdays-name">${weekdaysTr}</tr>`;
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
          monthDaysTable += `<td class="not-current-month">${previousMonthDays}</td>`;
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
        monthDaysTable += `<td class ="normal today" id=${this.currYear}-${stringMonth}-${stringDay}>${i}</td>`;
      } else {
        monthDaysTable += `<td class ="normal" id=${this.currYear}-${stringMonth}-${stringDay}>${i}</td>`;
      }
      if (dayOfWeekTemp === 0) {
        monthDaysTable += '</tr>';
      } else if (i === lastDateOfMonth) {
        let nextMonthDays = 1;
        for (dayOfWeekTemp; dayOfWeekTemp < 7; dayOfWeekTemp++) {
          monthDaysTable += `<td class="not-current-month">${nextMonthDays}</td>`;
          nextMonthDays++;
        }
      }
    }
    const monthDays = document.querySelector('.calendar-dates');
    if (monthDays) {
      monthDays.innerHTML = monthDaysTable;
    }
    const monthCell = document.querySelectorAll('.normal');
    monthCell.forEach((cell) =>
      cell.addEventListener('click', (event) =>
        this.onCalendarDateClick(event),
      ),
    );
    let renderMonth = '';
    if (this.currMonth < 10) {
      renderMonth = '0' + (this.currMonth + 1).toString();
    } else {
      renderMonth = (this.currMonth + 1).toString();
    }
    this.viewRenderForMonthTasks(`${this.currYear}-${renderMonth}`);
  }
  showNextMonth(): void {
    if (this.currMonth === 11) {
      this.currMonth = 0;
      this.currYear += 1;
    } else {
      this.currMonth += 1;
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
  async onCalendarDateClick(event: Event): Promise<void> {
    if (event.target) {
      if ((event.target as HTMLElement).classList.contains('task-ex')) {
        const taskId = (event.target as HTMLElement).id + '-1';
        try {
          const tempTask = await this.api.getTask(taskId);
          this.showTaskOnCell(tempTask);
        } catch (error) {
          console.log('Error during get task:', error);
        }
      } else {
        this.createNewTaskView(event.target as HTMLElement);
      }
    }
  }

  createNewTaskView(element: HTMLElement): void {
    const tempTaskID = element.id + '-1';
    this.taskActionType.innerText = 'Create new Task';
    this.taskParameters.innerHTML = `
    <label for="task-id">Task ID:</label>
    <input type="text" id="task-id" name="taskId" value="${tempTaskID}" readonly><br><br>
    <label for="name">Task Name:</label>
    <input type="text" id="name" name="name" value="new task1"><br><br>
<label for="date">Task Date:</label>
<input type="date" id="date" name="date" value="${element.id}"><br><br>
<label for="time">Task Time:</label>
<input type="time" id="time" name="time" value="00:00"><br><br>
    <label for="status">Task Status:</label>
    <select id="status" name="status">
    <option value="in progress" selected>In Progress</option>
    <option value="completed">Completed</option>
    <option value="pending">Pending</option>
    </select><br><br>
    <label for="tag">Task Tag:</label>
     <select id="tag" name="tag">
    <option value="personal" selected>Personal</option>
    <option value="work">Work</option>
    <option value="other">Other</option>
    </select><br><br>
    <label for="text">Task Description:</label>
    <textarea id="text" name="text">work</textarea><br><br>
    <button class='save-new-task'>Save</button>
    <button class='cancel-new-task-create'>Cancel</button>`;

    const saveNewTaskBtn: HTMLElement =
      this.taskParameters.querySelector('.save-new-task')!;
    saveNewTaskBtn.addEventListener('click', () => {
      const taskResult = this.getTaskParametersFromForm();
      element.classList.add('task-ex');
      this.taskListView.innerHTML += this.updateTaskListView(taskResult);

      this.api.createNewTask(taskResult);
      this.taskParameters.innerHTML = '';
      this.taskActionType.innerText = '';
    });
    const cancelNewTaskCreateBtn: HTMLElement = document.querySelector(
      '.cancel-new-task-create',
    )!;
    cancelNewTaskCreateBtn.addEventListener('click', () => {
      this.taskParameters.innerHTML = '';
      this.taskActionType.innerText = '';
    });
  }
  showTaskOnCell(task: ICalendarTask): void {
    this.taskActionType.innerText = 'Update Task View';
    this.taskParameters.innerHTML = `
    <label for="task-id">Task ID:</label>
    <input type="text" id="task-id" name="taskId" value="${task.taskId}" readonly><br><br>
    <label for="name">Task Name:</label>
    <input type="text" id="name" name="name" value="${task.name}"><br><br>
<label for="date">Task Date:</label>
<input type="date" id="date" name="date" value="${task.date.split(' ')[0]}"><br><br>
<label for="time">Task Time:</label>
<input type="time" id="time" name="time" value="${task.date.split(' ')[1]}"><br><br>
    <label for="status">Task Status:</label>
    <select id="status" name="status">
    <option value="in progress">In Progress</option>
    <option value="completed">Completed</option>
    <option value="pending">Pending</option>
    </select><br><br>
    <label for="tag">Task Tag:</label>
     <select id="tag" name="tag">
    <option value="personal">Personal</option>
    <option value="work">Work</option>
    <option value="other">Other</option>
    </select><br><br>
    <label for="text">Task Description:</label>
    <textarea id="text" name="text">${task.text}</textarea><br><br>
    <button class='save-updated-task-btn'>Save</button>
    <button class='cancel-update-task-btn'>Cancel</button>
    <button class='delete-task-btn'>Delete</button>`;

    const taskStatus = this.taskParameters.querySelector(
      '#status',
    ) as HTMLSelectElement;
    if (taskStatus) {
      taskStatus.value = task.status;
    }
    const taskTag = this.taskParameters.querySelector(
      '#tag',
    ) as HTMLSelectElement;
    if (taskTag) {
      taskTag.value = task.tag;
    }
    const btnToUpdateTask: HTMLElement = document.querySelector(
      '.save-updated-task-btn',
    )!;
    btnToUpdateTask.addEventListener('click', () => {
      const taskResult = this.getTaskParametersFromForm();
      const selectorAll = this.taskListView.querySelectorAll('DIV');
      selectorAll.forEach((selected) => {
        if (selected.classList.contains(taskResult.taskId)) {
          selected.innerHTML = this.updateTaskListView(taskResult);
        }
      });
      this.api.updateTask(taskResult);
    });
    const btnToCancelTaskView: HTMLElement = document.querySelector(
      '.cancel-update-task-btn',
    )!;
    btnToCancelTaskView.addEventListener('click', () => {
      this.taskParameters.innerHTML = '';
      this.taskActionType.innerText = '';
    });
    const btnToDeleteTask: HTMLElement =
      document.querySelector('.delete-task-btn')!;
    btnToDeleteTask.addEventListener('click', () => {
      const taskToDelete = this.getTaskParametersFromForm();
      this.deleteTask(taskToDelete);
      const cellToClearTask = document.querySelectorAll('TD');
      cellToClearTask.forEach((cell) => {
        if (taskToDelete.taskId.includes(`${cell.id}`)) {
          cell.classList.remove('task-ex');
        }
      });
      this.taskParameters.innerHTML = '';
      this.taskActionType.innerText = '';
    });
  }

  getTaskParametersFromForm(): ICalendarTask {
    const taskIdInput = document.getElementById('task-id');
    const taskNameInput = document.getElementById('name');
    const taskDateInput = (document.getElementById('date') as HTMLInputElement)
      .value;
    const taskTimeInput = (document.getElementById('time') as HTMLInputElement)
      .value;
    const taskStatusInput = document.getElementById('status');
    const taskTagInput = document.getElementById('tag');
    const taskTextInput = document.getElementById('text');
    const taskId = (taskIdInput as HTMLInputElement).value;
    const taskName = (taskNameInput as HTMLInputElement).value;
    const taskDate = taskDateInput + ' ' + taskTimeInput;
    const taskStatus = (taskStatusInput as HTMLSelectElement).value;
    const taskTag = (taskTagInput as HTMLSelectElement).value;
    const taskText = (taskTextInput as HTMLTextAreaElement).value;
    const taskFormResult: ICalendarTask = {
      taskId: taskId,
      name: taskName,
      date: taskDate,
      status: taskStatus as 'new' | 'in progress' | 'done',
      tag: taskTag as 'Personal' | 'Work' | 'Other',
      text: taskText,
    };
    return taskFormResult as ICalendarTask;
  }

  async viewRenderForMonthTasks(date: string): Promise<void> {
    const filteredTdCell = document.querySelectorAll('.normal');
    let taskListTemplate = '';

    try {
      const tasksList = await this.api.readTasks();
      if (tasksList) {
        this.taskListView.innerHTML = '';
        tasksList.forEach((element) => {
          if (element.taskId.includes(date)) {
            taskListTemplate = this.updateTaskListView(element);
            this.taskListView.innerHTML += taskListTemplate;
            filteredTdCell.forEach((cell) => {
              if (element.taskId.includes(cell.id)) {
                cell.classList.add('task-ex');
              }
            });
          }
        });
      }
    } catch (error) {
      console.log('Failed to read tasks', error);
    }
  }

  updateTaskListView(task: ICalendarTask) {
    const template = `
    <div class=${task.taskId}>
      <span class="key">Task id : </span>
      <span class="key-value">${task.taskId}</span><br><br>
      <span class="key">Name : </span>
      <span class="key-value">${task.name}</span><br><br>
      <span class="key">Date : </span>
      <span class="key-value">${task.date}</span><br><br>
      <span class="key">Tag : </span>
      <span class="key-value">${task.tag}</span><br><br>
      <span class="key">Status : </span>
      <span class="key-value">${task.status}</span><br><br>
      <span class="key">Text : </span>
      <span class="key-value">${task.text}</span><br><br><br><br>
    </div>`;
    return template;
  }

  async deleteTask(task: ICalendarTask) {
    try {
      await this.api.deleteTask(task);
      console.log('task was deleted');
    } catch (error) {
      console.log('Failed to delete task', error);
    }
  }
}
