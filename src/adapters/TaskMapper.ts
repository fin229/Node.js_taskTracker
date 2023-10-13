import short from "short-uuid";

import { TaskDto } from "../dto/TaskDto.js";
import { Task } from "../model/Task.js";
import { Mapper } from "./Mapper.js";
import { TASK_STATUS } from "../enums/TaskStatus.js";

export class Taskmapper implements Mapper<TaskDto, Task> {
    public toModel(input: TaskDto): Task {
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
        }
    }
    public toDto(input: Task): TaskDto {
        return {
            id: input.id,
            name: input.name,
            description: input.description,
            state: input.state,
            startedAt: input.startedAt && new Date(input.startedAt),
            finishedAt: input.finishedAt && new Date(input.finishedAt),
            createdAt: new Date(input.createdAt),
            lastUpdatedAt: new Date(input.lastUpdatedAt)
        }
    }

}