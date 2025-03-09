import { FireStore } from './firestore';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { ICalendarTask, ICalendarFilter } from './api';
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));
describe('Check all methods of FireStore class', () => {
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
    (getDocs as jest.Mock).mockResolvedValue({ docs: taskData });
    const fireStore = new FireStore('testCollection');
    const tasks = await fireStore.read();
    expect(collection).toHaveBeenCalledWith(
      expect.anything(),
      'testCollection',
    );
    expect(tasks).toEqual(taskData.map((doc) => doc.data()));
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
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    const fireStore = new FireStore('testCollection');
    await fireStore.create(mockTask);
    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      'testCollection',
      'task1',
    );
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, mockTask);
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
    (getDocs as jest.Mock).mockResolvedValue({ docs: mockData });

    const fireStore = new FireStore('testCollection');
    const filtered = await fireStore.filter('name', 'new task2');

    expect(filtered).toEqual([
      {
        taskId: 'task2',
        name: 'new task2',
        date: '2024-12-23 22:22:22',
        status: 'done',
        tag: 'personal',
        text: 'home',
      },
      {
        taskId: 'task3',
        name: 'new task2',
        date: '2024-12-24 24:24:24',
        status: 'in progress',
        tag: 'personal',
        text: 'home',
      },
    ]);
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
    const fireStore = new FireStore('testCollection');
    const collectionRef = { doc: jest.fn() };
    (collection as jest.Mock).mockReturnValue(collectionRef);
    const docRef = { id: 'task2' };
    (doc as jest.Mock).mockReturnValue(docRef);

    await fireStore.delete(mockTask);

    expect(doc).toHaveBeenCalledWith({}, 'testCollection', 'task2');
    expect(deleteDoc).toHaveBeenCalledWith(docRef);
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
    (doc as jest.Mock).mockReturnValue(mockDocRef);

    const fireStore = new FireStore('testCollection');
    await fireStore.update(mockTask);

    expect(doc).toHaveBeenCalledWith({}, 'testCollection', 'task1');
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, mockTask, { merge: true });
  });
});
