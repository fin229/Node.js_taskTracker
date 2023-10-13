import Table from "cli-table3";
import { format } from "timeago.js";

import { Task } from "../model/Task.js";
import { Comment } from "../model/Comment.js";

import { TASK_STATUS } from "../enums/TaskStatus.js";
import { truncate } from "../utility/StringUtil.js";

export const createTaskListTable = (tasks: Task[]) => {
    const tableInstance = new Table({
        head: ["ID", "Title", "Description", "State", "Created"],
    });

    tasks.forEach((task) => {
        tableInstance.push([task.id, task.name, truncate(task.description, 50), task.state, format(task.createdAt)]);
    });

    return tableInstance.toString();
}

export const createCommentListTable = (comments: Comment[]) => {
    const tableInstance = new Table({
        head: ["ID", "Text", "reason", "Created"],
    });

    comments.forEach((comment) => {
        tableInstance.push([comment.id, comment.text, comment.reason, new Date(comment.createdAt).toLocaleString()]);
    });

    return tableInstance.toString();
}

export const createTaskDetailsTable = (task: Task) => {
    const tableInstance = new Table({
        head: ["Key", "Value"],
    });

    tableInstance.push(["ID", task.id]);
    tableInstance.push(["Title", task.name]);
    tableInstance.push(["Description", task.description]);
    tableInstance.push(["State", task.state]);
    if (task.createdAt)
        tableInstance.push(["Created At", new Date(task.createdAt).toLocaleString()]);

    if (task.startedAt)
        tableInstance.push(["Started At", new Date(task.startedAt).toLocaleString()]);

    if (task.finishedAt)
        tableInstance.push(["Finished At", new Date(task.finishedAt).toLocaleString()]);

    switch (task.state) {
        case TASK_STATUS.OPEN:
            tableInstance.push(["Created", format(task.createdAt)]);
            break;
        case TASK_STATUS.IN_PROGRESS:
            tableInstance.push(["Started", format(task.startedAt)]);
            break;
        case TASK_STATUS.DONE:
            tableInstance.push(["Finished", format(task.finishedAt)]);
            break;
        default:
            tableInstance.push(["Created", format(task.createdAt)]);
            break;
    }

    return tableInstance.toString();
}