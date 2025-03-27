import { FireStore } from './firestore';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { ICalendarTask, ICalendarFilter } from './api';
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
  let fireStore: FireStore;
  let mockCollection: jest.Mock;
  let mockWhere: jest.Mock;
  let mockQuery: jest.Mock;
  let mockGetDocs: jest.Mock;
  let mockSetDoc: jest.Mock;
  let mockDeleteDoc: jest.Mock;
  let mockGetDoc: jest.Mock;
  let mockDoc: jest.Mock;

  beforeEach(() => {
    fireStore = new FireStore('testCollection');
    mockCollection = collection as jest.Mock;
    mockWhere = where as jest.Mock;
    mockQuery = query as jest.Mock;
    mockGetDocs = getDocs as jest.Mock;
    mockSetDoc = setDoc as jest.Mock;
    mockDeleteDoc = deleteDoc as jest.Mock;
    mockGetDoc = getDoc as jest.Mock;
    mockDoc = doc as jest.Mock;
    jest.clearAllMocks();
  });

  test('It provides all documents', async () => {
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

    const tasks = await fireStore.read();

    expect(mockCollection).toHaveBeenCalledWith(
      expect.anything(),
      'testCollection',
    );
    expect(tasks).toEqual(expectedTasks);
  });

  it('create() calls setDoc with correct arguments', async () => {
    const mockTask: ICalendarTask = {
      taskId: 'task1',
      name: 'new task1',
      date: '2024-12-22 23:23:23',
      status: 'in progress',
      tag: 'personal',
      text: 'work',
    };
    const mockDocRef = { id: 'task1' };
    mockDoc.mockReturnValue(mockDocRef);

    await fireStore.create(mockTask);

    expect(mockDoc).toHaveBeenCalledWith(
      expect.anything(),
      'testCollection',
      'task1',
    );
    expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, mockTask);
  });

  it('filter() returns tasks matching criteria', async () => {
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
    const filtered = await fireStore.filter('name', 'new task2');

    expect(mockWhere).toHaveBeenCalledWith('name', '==', 'new task2');
    expect(filtered).toEqual(FilteredTasks);
  });

  it('delete() removes document by ID', async () => {
    const mockTask: ICalendarTask = {
      taskId: 'task2',
      name: 'new task2',
      date: '2024-12-23 22:22:22',
      status: 'done',
      tag: 'personal',
      text: 'home',
    };

    const docRef = { id: 'task2' };
    mockDoc.mockReturnValue(docRef);

    await fireStore.delete(mockTask);

    expect(mockDoc).toHaveBeenCalledWith(
      expect.anything(),
      'testCollection',
      'task2',
    );
    expect(mockDeleteDoc).toHaveBeenCalledWith(docRef);
  });

  it('update() calls setDoc with correct arguments', async () => {
    const mockTask: ICalendarTask = {
      taskId: 'task1',
      name: 'new task1',
      date: '2024-12-22 23:23:23',
      status: 'in progress',
      tag: 'personal',
      text: 'work',
    };

    const mockDocRef = { id: 'task1' };
    mockDoc.mockReturnValue(mockDocRef);

    await fireStore.update(mockTask);

    expect(mockDoc).toHaveBeenCalledWith(
      expect.anything(),
      'testCollection',
      'task1',
    );
    expect(mockSetDoc).toHaveBeenCalledWith(
      mockDocRef,
      { ...mockTask },
      { merge: true },
    );
  });
});
