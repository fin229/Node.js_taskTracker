import { ValueOf } from "../utility/ValueOf.js";

export const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in-progress",
    POSTPONED: "postponed",
    DONE: "done"
} as const;

export type TaskStatus = ValueOf<typeof TASK_STATUS>;
export const taskStatuses: TaskStatus[] = Object.values(TASK_STATUS);