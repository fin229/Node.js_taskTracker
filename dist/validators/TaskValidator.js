import { TASK_STATUS } from "../enums/TaskStatus.js";
export const throwIfTaskNotExists = (task) => {
    if (!task)
        throw new Error("Task does not exist");
};
export const throwIfNotRemovable = (task) => {
    if (task.state === TASK_STATUS.IN_PROGRESS)
        throw new Error("Task is in progress, cannot be deleted");
};
export const throwIfNoActiveTask = (task, taskId) => {
    if (!task || !taskId)
        throw new Error("There is no active task");
};
export const throwIfTaskLocked = (task) => {
    if (task.state === TASK_STATUS.DONE)
        throw new Error("Task is done, cannot be modified");
};
//# sourceMappingURL=TaskValidator.js.map