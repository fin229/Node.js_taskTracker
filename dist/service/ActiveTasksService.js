import { CommentMapper } from "../adapters/CommentMapper.js";
import { COMMENT_REASON } from "../enums/CommentReason.js";
import { TASK_STATUS } from "../enums/TaskStatus.js";
import { throwIfNoActiveTask, throwIfTaskNotExists, throwIfTaskLocked } from "../validators/TaskValidator.js";
export class ActiveTasksService {
    container;
    commentMapper = new CommentMapper();
    constructor(container) {
        this.container = container;
    }
    async setActiveTask(id) {
        const activeTaskId = await this.container.tasksRepository.getActiveTaskId();
        if (activeTaskId)
            throw new Error("There is already an active task");
        const task = await this.container.tasksRepository.getById(id);
        throwIfTaskNotExists(task);
        throwIfTaskLocked(task);
        await this.container.tasksRepository.setActiveTaskId(id);
        task.startedAt = task.startedAt || new Date().toISOString();
        task.state = TASK_STATUS.IN_PROGRESS;
        await this.container.tasksRepository.update(task);
        return task;
    }
    async finishActiveTask() {
        const task = await this.getActiveTask();
        task.finishedAt = new Date().toISOString();
        task.state = TASK_STATUS.DONE;
        await this.container.tasksRepository.update(task);
        await this.container.tasksRepository.setActiveTaskId(null);
        return task;
    }
    async postponeActiveTask(comment) {
        const task = await this.getActiveTask();
        task.state = TASK_STATUS.POSTPONED;
        comment.reason = COMMENT_REASON.POSTPONED;
        task.comments.push(this.commentMapper.toModel(comment));
        await this.container.tasksRepository.update(task);
        await this.container.tasksRepository.setActiveTaskId(null);
        return task;
    }
    async getActiveTask() {
        const activeTaskId = await this.container.tasksRepository.getActiveTaskId();
        const task = await this.container.tasksRepository.getById(activeTaskId);
        try {
            throwIfNoActiveTask(task, activeTaskId);
        }
        catch (ex) {
            await this.container.tasksRepository.setActiveTaskId(null);
            throw (ex);
        }
        return task;
    }
}
//# sourceMappingURL=ActiveTasksService.js.map