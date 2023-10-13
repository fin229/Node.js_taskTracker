import { CommentMapper } from "../adapters/CommentMapper.js";
import { CommentDto } from "../dto/CommentDto.js";
import { COMMENT_REASON } from "../enums/CommentReason.js";
import { Task } from "../model/Task.js";
import { TASK_STATUS } from "../enums/TaskStatus.js";
import { TasksRepository } from "../repository/TasksRepository.js";
import { throwIfNoActiveTask, throwIfTaskNotExists, throwIfTaskLocked } from "../validators/TaskValidator.js";

export interface ActiveTasksServiceContainer {
    tasksRepository: TasksRepository
}

export class ActiveTasksService {
    private commentMapper = new CommentMapper();
    public constructor(private container: ActiveTasksServiceContainer) { }

    public async setActiveTask(id: string): Promise<Task> {
        const activeTaskId = await this.container.tasksRepository.getActiveTaskId();
        if (activeTaskId) throw new Error("There is already an active task");

        const task = await this.container.tasksRepository.getById(id);
        throwIfTaskNotExists(task);
        throwIfTaskLocked(task);

        await this.container.tasksRepository.setActiveTaskId(id);
        task.startedAt = task.startedAt || new Date().toISOString();
        task.state = TASK_STATUS.IN_PROGRESS;

        await this.container.tasksRepository.update(task);

        return task;
    }

    public async finishActiveTask(): Promise<Task> {
        const task = await this.getActiveTask();

        task.finishedAt = new Date().toISOString();
        task.state = TASK_STATUS.DONE;

        await this.container.tasksRepository.update(task);
        await this.container.tasksRepository.setActiveTaskId(null);

        return task;
    }

    public async postponeActiveTask(comment: CommentDto): Promise<Task> {
        const task = await this.getActiveTask();

        task.state = TASK_STATUS.POSTPONED;

        comment.reason = COMMENT_REASON.POSTPONED;
        task.comments.push(this.commentMapper.toModel(comment));

        await this.container.tasksRepository.update(task);
        await this.container.tasksRepository.setActiveTaskId(null);

        return task;
    }

    public async getActiveTask(): Promise<Task> {
        const activeTaskId = await this.container.tasksRepository.getActiveTaskId();
        const task = await this.container.tasksRepository.getById(activeTaskId);

        try {
            throwIfNoActiveTask(task, activeTaskId);
        } catch (ex) {
            await this.container.tasksRepository.setActiveTaskId(null);
            throw (ex);
        }

        return task;
    }

}