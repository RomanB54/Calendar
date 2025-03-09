import { IStorage, ICalendarTask, ICalendarFilter } from './api';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDfcdHF9h7ri5ZmSMoVI22n4-pZLP48Ogk',
  authDomain: 'testcalendar-e9965.firebaseapp.com',
  databaseURL: 'https://testcalendar-e9965-default-rtdb.firebaseio.com',
  projectId: 'testcalendar-e9965',
  storageBucket: 'testcalendar-e9965.firebasestorage.app',
  messagingSenderId: '726605419056',
  appId: '1:726605419056:web:9f0eb3714334f5f890d3f5',
  measurementId: 'G-51WBBXYG89',
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class FireStore implements IStorage {
  private storeID: string = 'calendarTasks';

  constructor(dataDB: string) {
    this.storeID = dataDB;
  }

  async create(task: ICalendarTask) {
    const docRef = doc(db, this.storeID, task.taskId);
    await setDoc(docRef, task);
  }

  async read(): Promise<ICalendarTask[]> {
    const tempData = await getDocs(collection(db, this.storeID));
    const tasks: ICalendarTask[] = tempData.docs.map((doc) => {
      return {
        ...doc.data(),
      } as ICalendarTask;
    });
    return tasks;
  }

  async update(task: ICalendarTask) {
    const taskTemp = doc(db, this.storeID, task.taskId);
    await setDoc(taskTemp, { ...task }, { merge: true });
  }

  async delete(task: ICalendarTask) {
    const deletedTask = doc(db, this.storeID, task.taskId);
    await deleteDoc(deletedTask);

  }

  async filter(
    filterOptionKey: keyof ICalendarFilter,
    filterOptionValue: ICalendarFilter[keyof ICalendarFilter],
  ): Promise<ICalendarTask[] | []> {
    const filteredTasks: ICalendarTask[] = [];

    const snapshot = await getDocs(collection(db, this.storeID));
    snapshot.docs.forEach((doc) => {
      const task = doc.data() as ICalendarTask;
      if (task[filterOptionKey] === filterOptionValue) {
        filteredTasks.push(task);
      }
    });

    return filteredTasks;
  }
}
