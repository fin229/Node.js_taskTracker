import short from "short-uuid";
import { TASK_STATUS } from "../enums/TaskStatus.js";
export class Taskmapper {
    toModel(input) {
        return {
            id: input.id || short.generate(),
            name: input.name,
            description: input.description || null,
            state: input.state || TASK_STATUS.OPEN,
            startedAt: input.startedAt?.toISOString() || null,
            finishedAt: input.finishedAt?.toISOString() || null,
            createdAt: input.createdAt?.toISOString() || new Date().toISOString(),
            lastUpdatedAt: input.lastUpdatedAt?.toISOString() || new Date().toISOString(),
            comments: []
        };
    }
    toDto(input) {
        return {
            id: input.id,
            name: input.name,
            description: input.description,
            state: input.state,
            startedAt: input.startedAt && new Date(input.startedAt),
            finishedAt: input.finishedAt && new Date(input.finishedAt),
            createdAt: new Date(input.createdAt),
            lastUpdatedAt: new Date(input.lastUpdatedAt)
        };
    }
}
//# sourceMappingURL=TaskMapper.js.map