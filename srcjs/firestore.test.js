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
const firestore_1 = require('./firestore');
const firestore_2 = require('firebase/firestore');
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/firestore', () => {
  const mockCollection = jest.fn();
  const mockWhere = jest.fn();
  const mockQuery = jest.fn();
  const mockGetDocs = jest.fn();
  const mockSetDoc = jest.fn();
  const mockDeleteDoc = jest.fn();
  const mockGetDoc = jest.fn();
  const mockDoc = jest.fn();
  return {
    getFirestore: jest.fn(() => ({})),
    collection: mockCollection,
    doc: mockDoc,
    query: mockQuery,
    where: mockWhere,
    getDocs: mockGetDocs,
    setDoc: mockSetDoc,
    deleteDoc: mockDeleteDoc,
    getDoc: mockGetDoc,
  };
});
describe('Check all methods of FireStore class', () => {
  let fireStore;
  let mockCollection;
  let mockWhere;
  let mockQuery;
  let mockGetDocs;
  let mockSetDoc;
  let mockDeleteDoc;
  let mockGetDoc;
  let mockDoc;
  beforeEach(() => {
    fireStore = new firestore_1.FireStore('testCollection');
    mockCollection = firestore_2.collection;
    mockWhere = firestore_2.where;
    mockQuery = firestore_2.query;
    mockGetDocs = firestore_2.getDocs;
    mockSetDoc = firestore_2.setDoc;
    mockDeleteDoc = firestore_2.deleteDoc;
    mockGetDoc = firestore_2.getDoc;
    mockDoc = firestore_2.doc;
    jest.clearAllMocks();
  });
  test('It provides all documents', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const taskData = [
        {
          id: 'task1',
          data: () => ({
            taskId: 'task1',
            name: 'new task1',
            date: '2024-12-22 23:23:23',
            status: 'in progress',
            tag: 'personal',
            text: 'work',
          }),
        },
        {
          id: 'task2',
          data: () => ({
            taskId: 'task2',
            name: 'new task2',
            date: '2024-12-23 22:22:22',
            status: 'done',
            tag: 'personal',
            text: 'home',
          }),
        },
      ];
      const expectedTasks = taskData.map((doc) => doc.data());
      mockGetDocs.mockResolvedValue({
        docs: taskData.map((task) => ({
          data: () => task.data(),
        })),
      });
      const tasks = yield fireStore.read();
      expect(mockCollection).toHaveBeenCalledWith(
        expect.anything(),
        'testCollection',
      );
      expect(tasks).toEqual(expectedTasks);
    }));
  it('create() calls setDoc with correct arguments', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const mockTask = {
        taskId: 'task1',
        name: 'new task1',
        date: '2024-12-22 23:23:23',
        status: 'in progress',
        tag: 'personal',
        text: 'work',
      };
      const mockDocRef = { id: 'task1' };
      mockDoc.mockReturnValue(mockDocRef);
      yield fireStore.create(mockTask);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        'testCollection',
        'task1',
      );
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, mockTask);
    }));
  it('filter() returns tasks matching criteria', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const mockData = [
        {
          id: 'task1',
          data: () => ({
            taskId: 'task1',
            name: 'new task1',
            date: '2024-12-22 23:23:23',
            status: 'in progress',
            tag: 'personal',
            text: 'work',
          }),
        },
        {
          id: 'task2',
          data: () => ({
            taskId: 'task2',
            name: 'new task2',
            date: '2024-12-23 22:22:22',
            status: 'done',
            tag: 'personal',
            text: 'home',
          }),
        },
        {
          id: 'task3',
          data: () => ({
            taskId: 'task3',
            name: 'new task2',
            date: '2024-12-24 24:24:24',
            status: 'in progress',
            tag: 'personal',
            text: 'home',
          }),
        },
      ];
      const FilteredTasks = mockData
        .map((doc) => doc.data())
        .filter((task) => task.name === 'new task2');
      mockGetDocs.mockResolvedValue({
        docs: mockData
          .filter((doc) => doc.data().name === 'new task2')
          .map((task) => ({
            data: () => task.data(),
          })),
      });
      mockWhere.mockReturnValue({});
      mockQuery.mockReturnValue({});
      const filtered = yield fireStore.filter('name', 'new task2');
      expect(mockWhere).toHaveBeenCalledWith('name', '==', 'new task2');
      expect(filtered).toEqual(FilteredTasks);
    }));
  it('delete() removes document by ID', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const mockTask = {
        taskId: 'task2',
        name: 'new task2',
        date: '2024-12-23 22:22:22',
        status: 'done',
        tag: 'personal',
        text: 'home',
      };
      const docRef = { id: 'task2' };
      mockDoc.mockReturnValue(docRef);
      yield fireStore.delete(mockTask);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        'testCollection',
        'task2',
      );
      expect(mockDeleteDoc).toHaveBeenCalledWith(docRef);
    }));
  it('update() calls setDoc with correct arguments', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const mockTask = {
        taskId: 'task1',
        name: 'new task1',
        date: '2024-12-22 23:23:23',
        status: 'in progress',
        tag: 'personal',
        text: 'work',
      };
      const mockDocRef = { id: 'task1' };
      mockDoc.mockReturnValue(mockDocRef);
      yield fireStore.update(mockTask);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        'testCollection',
        'task1',
      );
      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        Object.assign({}, mockTask),
        { merge: true },
      );
    }));
});
