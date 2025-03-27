import { IStorage, ICalendarTask, ICalendarFilter } from './api';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
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
    try {
      const queryRef = collection(db, this.storeID);
      const q = query(
        queryRef,
        where(filterOptionKey as string, '==', filterOptionValue),
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return [];
      }
      const filteredArray: ICalendarTask[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data as ICalendarTask;
      });
      return filteredArray;
    } catch (error) {
      console.log('Error filtering tasks:', error);
      return [];
    }
  }

  async getOneTask(taskIdForSearch: string) {
    const docRef = doc(db, this.storeID, taskIdForSearch);
    const docSnap = await getDoc(docRef);
    const parsedSnap = docSnap.data();
    if (!docSnap || !parsedSnap) {
      throw new Error(`Task with ID ${taskIdForSearch} not found or empty`);
    }

    return parsedSnap as ICalendarTask;
  }
}
