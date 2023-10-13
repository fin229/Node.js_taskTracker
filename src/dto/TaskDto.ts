import { TaskStatus } from "../enums/TaskStatus.js";

export interface TaskDto {
    id?: string;
    name: string;
    description?: string;
    state?: TaskStatus,
    startedAt?: Date;
    finishedAt?: Date;
    createdAt?: Date;
    lastUpdatedAt?: Date;
}