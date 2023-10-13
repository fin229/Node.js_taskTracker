import { Taskmapper } from "../adapters/TaskMapper.js";
import FuzzySearch from "fuzzy-search";
import { SEARCH_ORDER_OPTION } from "../enums/SearchOrder.js";
import { throwIfTaskNotExists, throwIfNotRemovable } from "../validators/TaskValidator.js";
import { throwIfTaskNameAndDescriptionNotValid } from "../validators/TaskDtoValidator.js";
export class TasksService {
    container;
    taskMapper = new Taskmapper();
    constructor(container) {
        this.container = container;
    }
    async addTask(task) {
        const taskModel = this.taskMapper.toModel(task);
        throwIfTaskNameAndDescriptionNotValid(task);
        await this.container.tasksRepository.create(taskModel);
        return taskModel;
    }
    async getTask(id) {
        const task = await this.container.tasksRepository.getById(id);
        throwIfTaskNotExists(task);
        return task;
    }
    async removeTask(id) {
        const task = await this.container.tasksRepository.getById(id);
        throwIfTaskNotExists(task);
        throwIfNotRemovable(task);
        await this.container.tasksRepository.delete(id);
    }
    async updateTask(id, taskDto) {
        const task = await this.container.tasksRepository.getById(id);
        throwIfTaskNotExists(task);
        throwIfTaskNameAndDescriptionNotValid(taskDto);
        task.name = taskDto.name;
        task.description = taskDto.description;
        await this.container.tasksRepository.update(task);
        return task;
    }
    async searchTasks(searchTerm, opts) {
        const tasks = await this.container.tasksRepository.getAll();
        const result = searchTerm ? new FuzzySearch(tasks, ['name', 'description'], {
            caseSensitive: true,
        }).search(searchTerm) : tasks;
        const filteredTasks = opts.taskStatus ? result.filter((task) => task.state === opts.taskStatus) : result;
        const sortedTasks = filteredTasks.sort((a, b) => {
            switch (opts.sortBy) {
                case SEARCH_ORDER_OPTION.NAME:
                    return a.name.localeCompare(b.name);
                case SEARCH_ORDER_OPTION.FINSIHED_AT:
                    return new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime();
                case SEARCH_ORDER_OPTION.CREATED_AT:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });
        return sortedTasks;
    }
}
//# sourceMappingURL=TasksService.js.map