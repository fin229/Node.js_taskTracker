import { CLIProgram } from "./cli.js";
import { ActiveTasksService } from "./service/ActiveTasksService.js";
import { CommentService } from "./service/CommentService.js";
import { TasksService } from "./service/TasksService.js";
import { DBManager } from "./repository/DBManager.js";

const dbManager = new DBManager();
await dbManager.init();

const tasksService = new TasksService({ tasksRepository: dbManager.repositories.tasks });
const activeTasksService = new ActiveTasksService({ tasksRepository: dbManager.repositories.tasks });
const commentService = new CommentService({ tasksRepository: dbManager.repositories.tasks });

await CLIProgram({ tasksService, activeTasksService, commentService }).parseAsync(process.argv);
