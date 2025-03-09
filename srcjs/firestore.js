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
exports.FireStore = void 0;
const app_1 = require('firebase/app');
const firestore_1 = require('firebase/firestore');
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
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
class FireStore {
  constructor(dataDB) {
    this.storeID = 'calendarTasks';
    this.storeID = dataDB;
  }
  create(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const docRef = (0, firestore_1.doc)(db, this.storeID, task.taskId);
      yield (0, firestore_1.setDoc)(docRef, task);
    });
  }
  read() {
    return __awaiter(this, void 0, void 0, function* () {
      const tempData = yield (0, firestore_1.getDocs)(
        (0, firestore_1.collection)(db, this.storeID),
      );
      const tasks = tempData.docs.map((doc) => {
        return Object.assign({}, doc.data());
      });
      return tasks;
    });
  }
  update(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const taskTemp = (0, firestore_1.doc)(db, this.storeID, task.taskId);
      yield (0, firestore_1.setDoc)(taskTemp, Object.assign({}, task), {
        merge: true,
      });
    });
  }
  delete(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const deletedTask = (0, firestore_1.doc)(db, this.storeID, task.taskId);
      yield (0, firestore_1.deleteDoc)(deletedTask);
    });
  }
  filter(filterOptionKey, filterOptionValue) {
    return __awaiter(this, void 0, void 0, function* () {
      const filteredTasks = [];
      const snapshot = yield (0, firestore_1.getDocs)(
        (0, firestore_1.collection)(db, this.storeID),
      );
      snapshot.docs.forEach((doc) => {
        const task = doc.data();
        if (task[filterOptionKey] === filterOptionValue) {
          filteredTasks.push(task);
        }
      });
      return filteredTasks;
    });
  }
}
exports.FireStore = FireStore;
