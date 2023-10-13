import { CommentMapper } from "../adapters/CommentMapper.js";
import { CommentDto } from "../dto/CommentDto.js";
import { COMMENT_REASON } from "../enums/CommentReason.js";
import { Task } from "../model/Task.js";
import { TasksRepository } from "../repository/TasksRepository.js";
import { throwIfTaskNotExists, throwIfTaskLocked } from "../validators/TaskValidator.js";

export interface CommentServiceContainer {
    tasksRepository: TasksRepository
}

export class CommentService {
    private commentMapper: CommentMapper = new CommentMapper();
    public constructor(private container: CommentServiceContainer) { }

    public async addComment(task: Task, comment: CommentDto) {
        throwIfTaskNotExists(task);
        throwIfTaskLocked(task);

        const modelComment = this.commentMapper.toModel(comment);
        modelComment.reason = COMMENT_REASON.USER_COMMENT;
        task.comments.push(modelComment);

        await this.container.tasksRepository.update(task);
    }
}