import { assert } from "chai";

import * as validator from "../../src/validators/TaskValidator";

import { TASK_STATUS } from "../../src/enums/TaskStatus";
import { Task } from "../../src/model/Task";

describe("validators#TaskValidator", () => {
    const createTask = (input?: Partial<Task>): Task => ({
        id: "",
        state: TASK_STATUS.IN_PROGRESS,
        name: "",
        description: "",
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        ...(input || {})
    });

    describe("throwIfTaskNotExists", () => {
        it("should throw when the task doesn't exist", () => {
            assert.throws(() => validator.throwIfTaskNotExists(undefined), "Task does not exist");
        });

        it("should not throw when the task exist", () => {
            const task = createTask();
            assert.doesNotThrow(() => validator.throwIfTaskNotExists(task), "Task does not exist");
        });
    });

    describe("throwIfNotRemovable", () => {
        it("should fail when a task is in progress", () => {
            const task = createTask({ state: TASK_STATUS.IN_PROGRESS });
            assert.throws(() => validator.throwIfNotRemovable(task), "Task is in progress, cannot be deleted");
        });

        it("should not fail when a task is not in progress", () => {
            const task = createTask({ state: TASK_STATUS.DONE });
            assert.doesNotThrow(() => validator.throwIfNotRemovable(task), "Task is in progress, cannot be deleted");
        });
    })
});
