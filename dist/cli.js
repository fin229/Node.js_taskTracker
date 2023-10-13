import { Command, Option } from "commander";
import enq from "enquirer";
import { TASK_STATUS, taskStatuses } from "./enums/TaskStatus.js";
import { createCommentListTable, createTaskDetailsTable, createTaskListTable } from "./display/TableDisplay.js";
import { boldPrefix, error, info, success } from "./display/TextDisplay.js";
import { SEARCH_ORDER_OPTION, searchOrderOptions } from "./enums/SearchOrder.js";
function errorHandler(err) {
    error(err.message);
}
function actionWrapper(fn) {
    return (...args) => fn(...args).catch(errorHandler);
}
export const CLIProgram = ({ tasksService, activeTasksService, commentService }) => {
    const program = new Command();
    program
        .command("list")
        .argument("[search]", "fuzzy search term")
        .addOption(new Option("-s, --status <status>", "filter by status").choices(taskStatuses))
        .addOption(new Option("-o, --order <order>", "order by").choices(searchOrderOptions).default(SEARCH_ORDER_OPTION.CREATED_AT))
        .description("Search in all tasks using provided options")
        .action(actionWrapper(async (search, options) => {
        const tasks = await tasksService.searchTasks(search, {
            taskStatus: options.status,
            sortBy: options.order
        });
        const table = createTaskListTable(tasks);
        info("Found the following tasks: ");
        console.log(table);
    }));
    program
        .command("add")
        .argument("<title>", "title of the task")
        .addOption(new Option("-d, --description <description>", "description of the task"))
        .description("Add a new task").action(actionWrapper(async (title, options) => {
        const task = await tasksService.addTask({
            name: title,
            description: options.description,
            state: TASK_STATUS.OPEN
        });
        success("Added task", title);
        boldPrefix("ID: ", task.id);
    }));
    program
        .command("remove")
        .argument("<id>", "id of the task to be removed")
        .description("Remove a task").action(actionWrapper(async (id) => {
        await tasksService.removeTask(id);
        success("Removed task", id);
    }));
    program
        .command("update")
        .argument("<id>", "id of the task to be updated")
        .description("Update a task").action(actionWrapper(async (id) => {
        info("Updating task", id);
        const task = await tasksService.getTask(id);
        if (!task)
            throw new Error("Task does not exist");
        const { name } = await enq.prompt({
            type: "input",
            name: "name",
            message: "What's the new name?",
            initial: task.name
        });
        const { description } = await enq.prompt({
            type: "input",
            name: "description",
            message: "What's the new description?",
            initial: task.description
        });
        await tasksService.updateTask(id, { name: name, description: description });
        success("Updated task", id);
    }));
    program
        .command("start")
        .argument("<id>", "id of the task to start")
        .description("Start a task and mark it as in-progress")
        .action(actionWrapper(async (id) => {
        const activeTask = await activeTasksService.setActiveTask(id);
        success("Marked task as in progress: ");
        boldPrefix("ID: ", activeTask.id);
    }));
    program
        .command("show")
        .argument("[id]", "id of the task to show")
        .description("Show detailed information for the currently active (or specified) task")
        .action(actionWrapper(async (id) => {
        const task = id ? await tasksService.getTask(id) : await activeTasksService.getActiveTask();
        info("TASK Details: ");
        console.log(createTaskDetailsTable(task));
        boldPrefix("Comments: ");
        console.log(createCommentListTable(task.comments));
    }));
    program.command("postpone")
        .description("Postpone the current active task")
        .argument("<reason>", "reason for postponing the task (to be added as comment)")
        .action(actionWrapper(async (reason) => {
        const postponedTask = await activeTasksService.postponeActiveTask({
            text: reason,
        });
        success("Postponed task: ");
        boldPrefix("ID: ", postponedTask.id);
        boldPrefix("With reason: ", reason);
    }));
    program.command("finish")
        .description("Finish the current active task")
        .action(actionWrapper(async () => {
        const finishedTask = await activeTasksService.finishActiveTask();
        success("Finished task: ");
        boldPrefix("ID: ", finishedTask.id);
    }));
    program.command("comment")
        .argument("<comment>", "comment to add")
        .addOption(new Option("-i, --id <id>", "id of the task to add the comment to"))
        .description("Add a comment to the active (or specified) task")
        .action(actionWrapper(async (comment, options) => {
        const task = options.id ? await tasksService.getTask(options.id) : await activeTasksService.getActiveTask();
        await commentService.addComment(task, {
            text: comment,
        });
        success("Added comment to task: ");
        boldPrefix("ID: ", task.id);
        boldPrefix("Comment: ", comment);
    }));
    return program;
};
//# sourceMappingURL=cli.js.map