import { TaskStatus } from "../enums/TaskStatus.js";
import { Comment } from "./Comment.js";

export interface Task {
    id: string;
    name: string;
    description: string;
    state: TaskStatus,
    startedAt?: string;
    finishedAt?: string;
    createdAt: string;
    lastUpdatedAt: string;
    comments?: Comment[];
}