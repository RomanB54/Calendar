import { Calendar } from './calendar';

const mockApi = {
  getTask: jest.fn(),
  createNewTask: jest.fn(),
  updateTask: jest.fn(),
  readTasks: jest.fn(),
  deleteTask: jest.fn(),
  filterTasks: jest.fn(),
};

describe('Calendar', () => {
  let calendar: Calendar;
  let el: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="calendar"></div>';
    el = document.getElementById('calendar')!;

    calendar = new Calendar(el, mockApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create a Calendar instance', () => {
    expect(calendar).toBeInstanceOf(Calendar);
  });

  it('initialize the calendar element with the correct HTML structure', () => {
    expect(el.querySelector('.calendar-header')).not.toBeNull();
    expect(el.querySelector('table.weekdays')).not.toBeNull();
    expect(el.querySelector('table.calendar-dates')).not.toBeNull();
    expect(el.querySelector('.task-field')).not.toBeNull();
  });
  it('render the calendar header correctly', () => {
    const header = el.querySelector('.calendar-header');
    expect(header).not.toBeNull();
    expect(header?.innerHTML).toContain(
      '<div class="month-year"><p>March 2025</p></div>',
    );
  });

  it('attach event listeners to the previous and next month buttons', () => {
    const prevMonthButton = el.querySelector(
      '.prev-month',
    ) as HTMLButtonElement;
    const nextMonthButton = el.querySelector(
      '.next-month',
    ) as HTMLButtonElement;

    expect(prevMonthButton).not.toBeNull();
    expect(nextMonthButton).not.toBeNull();

    const prevMonthClick = jest.spyOn(calendar, 'onShowPrevMonth');
    const nextMonthClick = jest.spyOn(calendar, 'onShowNextMonth');

    prevMonthButton.click();
    nextMonthButton.click();

    expect(prevMonthClick).toHaveBeenCalled();
    expect(nextMonthClick).toHaveBeenCalled();
  });

  it('initialize current date, month, year, and day', () => {
    const currentDate = new Date();
    expect(calendar['currMonth']).toEqual(currentDate.getMonth());
    expect(calendar['currYear']).toEqual(currentDate.getFullYear());
    expect(calendar['currDay']).toEqual(currentDate.getDate());
  });

  describe('showCurrentMonthValue', () => {
    it('update the monthYear element with the correct month and year', () => {
      calendar.showCurrentMonthValue(0, 2025);
      const monthYearField = el.querySelector('.month-year');
      expect(monthYearField?.textContent).toBe('January 2025');
    });
  });
  describe('showFilterMenu', () => {
    it('render the filter menu with correct HTML', () => {
      calendar.showFilterMenu(2, 2025);
      expect(calendar['taskFilterView'].innerHTML).toContain(
        '<select id="task-filter-para" name="FilterType">',
      );
      expect(calendar['taskFilterView'].innerHTML).toContain(
        '<input type="text" id="input-data-filter" name="InputFilterPara" value="new task1">',
      );
      expect(calendar['taskFilterView'].innerHTML).toContain(
        '<button class="apply-filter">Apply</button>',
      );
      expect(calendar['taskFilterView'].innerHTML).toContain(
        '<button class="cancel-filter">Cancel</button>',
      );
    });

    it('call filterTasks when applyFilter button is clicked', async () => {
      calendar.showFilterMenu(2, 2025);
      const applyFilterBtn = calendar['taskFilterView'].querySelector(
        '.apply-filter',
      ) as HTMLButtonElement;
      const filterValueElement = calendar['taskFilterView'].querySelector(
        '#input-data-filter',
      ) as HTMLInputElement;
      filterValueElement.value = 'test filter value';
      (mockApi.filterTasks as jest.Mock).mockResolvedValue([]);

      applyFilterBtn.click();

      await Promise.resolve();

      expect(mockApi.filterTasks).toHaveBeenCalledWith(
        expect.anything(),
        'test filter value',
      );
    });

    it('call viewRenderForMonthTasks and remove class when cancelFilter button is clicked', () => {
      const viewRenderForMonthTasksSpy = jest.spyOn(
        calendar,
        'viewRenderForMonthTasks',
      );
      calendar.showMonth = jest.fn();
      calendar.showFilterMenu(2, 2025);
      const cancelFilterBtn = calendar['taskFilterView'].querySelector(
        '.cancel-filter',
      ) as HTMLButtonElement;

      cancelFilterBtn.click();

      expect(viewRenderForMonthTasksSpy).toHaveBeenCalled();
    });
  });
  describe('showMonth', () => {
    it('render the weekdays table with the correct days of the week', () => {
      calendar.showMonth(2, 2025);
      const weekdaysTable = el.querySelector('.weekdays');
      expect(weekdaysTable?.innerHTML).toBe(
        '<tbody><tr class="weekdays-name"><td>Mo</td><td>Tu</td><td>We</td><td>Th</td><td>Fr</td><td>Sa</td><td>Su</td></tr></tbody>',
      );
    });

    it('render the calendar dates table with the correct number of days', () => {
      calendar.showMonth(2, 2025);
      const monthDaysTable = el.querySelector('.calendar-dates');
      expect(monthDaysTable?.innerHTML).toContain(
        '<td class="normal" id="2025-03-01">1</td>',
      );
      expect(monthDaysTable?.innerHTML).toContain(
        '<td class="normal" id="2025-03-31">31</td>',
      );
    });

    it('call viewRenderForMonthTasks with the correct date', () => {
      const viewRenderForMonthTasksSpy = jest.spyOn(
        calendar,
        'viewRenderForMonthTasks',
      );
      calendar.showMonth(2, 2025);
      expect(viewRenderForMonthTasksSpy).toHaveBeenCalledWith('2025-03');
    });

    it('add event listeners to each day cell', () => {
      calendar.showMonth(2, 2025);
      const firstDayCell = el.querySelector('td.normal') as HTMLElement;
      expect(firstDayCell).not.toBeNull();
      const onCalendarDateClickSpy = jest.spyOn(
        calendar,
        'onCalendarDateClick',
      );

      const clickEvent = new MouseEvent('click', { bubbles: true });
      firstDayCell.dispatchEvent(clickEvent);

      expect(onCalendarDateClickSpy).toHaveBeenCalledWith(
        expect.any(MouseEvent),
      );
      expect(onCalendarDateClickSpy.mock.calls[0][0].target).toBe(firstDayCell);
    });
  });
  describe('onCalendarDateClick', () => {
    it('call createNewTaskView if the clicked cell does not have class taskEx', () => {
      const createNewTaskViewSpy = jest.spyOn(calendar, 'createNewTaskView');
      const event = {
        target: {
          classList: {
            contains: () => false,
          },
          id: '2025-03-27',
        },
      } as unknown as Event;

      calendar.onCalendarDateClick(event);

      expect(createNewTaskViewSpy).toHaveBeenCalledWith(event.target);
    });
  });
  describe('createNewTaskView', () => {
    it('set the taskActionType text to "Create new Task"', () => {
      const element = { id: '2025-03-27' } as HTMLElement;
      calendar.createNewTaskView(element);
      expect(calendar['taskActionType'].innerText).toBe('Create new Task');
    });

    it('render the task parameters form with the correct default values', () => {
      const element = { id: '2025-03-27' } as HTMLElement;
      calendar.createNewTaskView(element);
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<input type="text" id="task-id" name="taskId" value="2025-03-27-1" readonly="">',
      );
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<input type="text" id="name" name="name" value="new task1">',
      );
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<input type="date" id="date" name="date" value="2025-03-27">',
      );
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<input type="time" id="time" name="time" value="00:00">',
      );
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<select id="status" name="status">',
      );
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<select id="tag" name="tag">',
      );
      expect(calendar['taskParameters'].innerHTML).toContain(
        '<textarea id="text" name="text">work</textarea>',
      );
    });
  });
});
