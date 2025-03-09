'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const localstorage_1 = require('./localstorage');
describe('LocalStorage', () => {
  const localId = 'calendarTasks';
  const storage = new localstorage_1.LocalStorage(localId);
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
    date: '2022-08-22 11:11:11',
    status: 'in progress',
    tag: 'home',
    text: 'homework',
  };
  const taskThree = {
    taskId: 'task3',
    name: 'new task3',
    date: '2022-08-22',
    status: 'new',
    tag: 'personel',
    text: 'homework 2',
  };
  const taskTest = {
    taskId: 'task2',
    name: 'updated task',
    date: '2022-08-23',
    status: 'done',
    tag: 'test',
    text: 'do my homework',
  };
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield storage.create(taskOne);
      yield storage.create(taskTwo);
      yield storage.create(taskThree);
    }),
  );
  it('should read data from localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      expect(yield storage.read()).toStrictEqual([taskOne, taskTwo, taskThree]);
    }));
  it('should update data in localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield storage.update(taskTest);
      expect(yield storage.read()).toStrictEqual([
        taskOne,
        taskTest,
        taskThree,
      ]);
    }));
  it('should remove data from localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield storage.delete(taskTest);
      expect(yield storage.read()).toStrictEqual([taskOne, taskThree]);
    }));
  it('should filter data by tag from localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      expect(yield storage.filter('tag', 'personal')).toStrictEqual([taskOne]);
    }));
  it('should filter data by status from localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      expect(yield storage.filter('status', 'new')).toStrictEqual([taskThree]);
    }));
  it('should filter data by description from localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      expect(yield storage.filter('text', 'work')).toStrictEqual([taskOne]);
    }));
  it('should filter data by date from localStorage', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      expect(yield storage.filter('date', '2024-12-22 23:23:23')).toEqual([
        taskOne,
      ]);
    }));
});
