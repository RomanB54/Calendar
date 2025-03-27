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
exports.LocalStorage = void 0;
class LocalStorage {
  constructor(dataDB) {
    this.storeID = 'calendarTasks';
    this.localStorage = localStorage;
    this.storeID = dataDB;
  }
  create(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const tempArr = yield this.read();
      tempArr.push(task);
      this.localStorage.setItem(this.storeID, JSON.stringify(tempArr));
    });
  }
  read() {
    return __awaiter(this, void 0, void 0, function* () {
      const tempData = this.localStorage.getItem(this.storeID);
      if (tempData) {
        return JSON.parse(tempData);
      } else {
        return [];
      }
    });
  }
  update(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const tempData = yield this.read();
      const newData = tempData.map((item) =>
        task.taskId === item.taskId ? task : item,
      );
      return localStorage.setItem(this.storeID, JSON.stringify(newData));
    });
  }
  delete(task) {
    return __awaiter(this, void 0, void 0, function* () {
      const tempData = yield this.read();
      for (let i = 0; i < tempData.length; i++) {
        if (task.taskId === tempData[i].taskId) {
          tempData.splice(i, 1);
        }
      }
      return localStorage.setItem(this.storeID, JSON.stringify(tempData));
    });
  }
  filter(filterOptionKey, filterOptionValue) {
    return __awaiter(this, void 0, void 0, function* () {
      const taskList = yield this.read();
      if (filterOptionKey && filterOptionValue) {
        return taskList.filter(
          (task) => task[filterOptionKey] === filterOptionValue,
        );
      }
      return [];
    });
  }
  getOneTask(taskIdForSearch) {
    return __awaiter(this, void 0, void 0, function* () {
      const tempData = yield this.read();
      const newData = tempData.find((task) => task.taskId === taskIdForSearch);
      if (!newData) {
        throw new Error(`Task with ID ${taskIdForSearch} not found`);
      }
      return newData;
    });
  }
}
exports.LocalStorage = LocalStorage;
