import { TASK_STATUS } from "../enums/TaskStatus.js";
import { Task } from "../model/Task.js";

export const throwIfTaskNotExists = (task?: Task) => {
    if (!task) throw new Error("Task does not exist");
}

export const throwIfNotRemovable = (task: Task) => {
    if (task.state === TASK_STATUS.IN_PROGRESS) throw new Error("Task is in progress, cannot be deleted");
}

export const throwIfNoActiveTask = (task: Task, taskId: string) => {
    if (!task || !taskId) throw new Error("There is no active task");
}

export const throwIfTaskLocked = (task: Task) => {
    if (task.state === TASK_STATUS.DONE) throw new Error("Task is done, cannot be modified");
}