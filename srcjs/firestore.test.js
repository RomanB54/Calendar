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
const firestore_1 = require("./firestore");
const firestore_2 = require("firebase/firestore");
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
    test('It provides all documents', () => __awaiter(void 0, void 0, void 0, function* () {
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
        firestore_2.getDocs.mockResolvedValue({ docs: taskData });
        const fireStore = new firestore_1.FireStore('testCollection');
        const tasks = yield fireStore.read();
        expect(firestore_2.collection).toHaveBeenCalledWith(expect.anything(), 'testCollection');
        expect(tasks).toEqual(taskData.map((doc) => doc.data()));
    }));
    it('create() calls setDoc with correct arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTask = {
            taskId: 'task1',
            name: 'new task1',
            date: '2024-12-22 23:23:23',
            status: 'in progress',
            tag: 'personal',
            text: 'work',
        };
        const mockDocRef = { id: 'task1' };
        firestore_2.doc.mockReturnValue(mockDocRef);
        const fireStore = new firestore_1.FireStore('testCollection');
        yield fireStore.create(mockTask);
        expect(firestore_2.doc).toHaveBeenCalledWith(expect.anything(), 'testCollection', 'task1');
        expect(firestore_2.setDoc).toHaveBeenCalledWith(mockDocRef, mockTask);
    }));
    it('filter() returns tasks matching criteria', () => __awaiter(void 0, void 0, void 0, function* () {
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
        firestore_2.getDocs.mockResolvedValue({ docs: mockData });
        const fireStore = new firestore_1.FireStore('testCollection');
        const filtered = yield fireStore.filter('name', 'new task2');
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
    }));
    it('delete() removes document by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTask = {
            taskId: 'task2',
            name: 'new task2',
            date: '2024-12-23 22:22:22',
            status: 'done',
            tag: 'personal',
            text: 'home',
        };
        const fireStore = new firestore_1.FireStore('testCollection');
        const collectionRef = { doc: jest.fn() };
        firestore_2.collection.mockReturnValue(collectionRef);
        const docRef = { id: 'task2' };
        firestore_2.doc.mockReturnValue(docRef);
        yield fireStore.delete(mockTask);
        expect(firestore_2.doc).toHaveBeenCalledWith({}, 'testCollection', 'task2');
        expect(firestore_2.deleteDoc).toHaveBeenCalledWith(docRef);
    }));
    it('update() calls setDoc with correct arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTask = {
            taskId: 'task1',
            name: 'new task1',
            date: '2024-12-22 23:23:23',
            status: 'in progress',
            tag: 'personal',
            text: 'work',
        };
        const mockDocRef = { id: 'task1' };
        firestore_2.doc.mockReturnValue(mockDocRef);
        const fireStore = new firestore_1.FireStore('testCollection');
        yield fireStore.update(mockTask);
        expect(firestore_2.doc).toHaveBeenCalledWith({}, 'testCollection', 'task1');
        expect(firestore_2.setDoc).toHaveBeenCalledWith(mockDocRef, mockTask, { merge: true });
    }));
});
