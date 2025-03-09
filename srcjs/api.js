"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = exports.STORAGES = void 0;
const localstorage_1 = require("./localstorage");
const firestore_1 = require("./firestore");
var STORAGES;
(function (STORAGES) {
    STORAGES["localStorage"] = "LocalStorage";
    STORAGES["fireStore"] = "FireStore";
})(STORAGES || (exports.STORAGES = STORAGES = {}));
class Calendar {
    constructor(type) {
        this.storeID = 'calendarTasks';
        this.type = type;
        this.storage =
            type === STORAGES.localStorage
                ? new localstorage_1.LocalStorage(this.storeID)
                : new firestore_1.FireStore(this.storeID);
    }
    create(task) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.create(task);
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.read();
        });
    }
    update(task) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.update(task);
        });
    }
    delete(task) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.delete(task);
        });
    }
    filter(filterOptionKey, filterOptionValue) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.filter(filterOptionKey, filterOptionValue);
        });
    }
}
exports.Calendar = Calendar;
