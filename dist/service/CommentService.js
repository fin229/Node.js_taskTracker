import { CommentMapper } from "../adapters/CommentMapper.js";
import { COMMENT_REASON } from "../enums/CommentReason.js";
import { throwIfTaskNotExists, throwIfTaskLocked } from "../validators/TaskValidator.js";
export class CommentService {
    container;
    commentMapper = new CommentMapper();
    constructor(container) {
        this.container = container;
    }
    async addComment(task, comment) {
        throwIfTaskNotExists(task);
        throwIfTaskLocked(task);
        const modelComment = this.commentMapper.toModel(comment);
        modelComment.reason = COMMENT_REASON.USER_COMMENT;
        task.comments.push(modelComment);
        await this.container.tasksRepository.update(task);
    }
}
//# sourceMappingURL=CommentService.js.map