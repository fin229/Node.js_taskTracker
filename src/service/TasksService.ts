import { Taskmapper } from "../adapters/TaskMapper.js";
import { TaskDto } from "../dto/TaskDto.js";
import { TaskStatus } from "../enums/TaskStatus.js";
import { TasksRepository } from "../repository/TasksRepository.js";

import FuzzySearch from "fuzzy-search";
import { SEARCH_ORDER_OPTION, SearchOrderOption } from "../enums/SearchOrder.js";
import { throwIfTaskNotExists, throwIfNotRemovable } from "../validators/TaskValidator.js";
import { throwIfTaskNameAndDescriptionNotValid } from "../validators/TaskDtoValidator.js";

export interface TasksServiceContainer {
    tasksRepository: TasksRepository
}

export interface SearchOpts {
    sortBy?: SearchOrderOption;
    taskStatus?: TaskStatus;
}

export class TasksService {
    private taskMapper = new Taskmapper();

    public constructor(private container: TasksServiceContainer) { }

    public async addTask(task: TaskDto) {
        const taskModel = this.taskMapper.toModel(task);

        throwIfTaskNameAndDescriptionNotValid(task);
        await this.container.tasksRepository.create(taskModel);

        return taskModel;
    }

    public async getTask(id: string) {
        const task = await this.container.tasksRepository.getById(id);

        throwIfTaskNotExists(task);

        return task;
    }

    public async removeTask(id: string) {
        const task = await this.container.tasksRepository.getById(id);

        throwIfTaskNotExists(task);
        throwIfNotRemovable(task);

        await this.container.tasksRepository.delete(id);
    }

    public async updateTask(id: string, taskDto: TaskDto) {
        const task = await this.container.tasksRepository.getById(id);

        throwIfTaskNotExists(task);
        throwIfTaskNameAndDescriptionNotValid(taskDto);

        task.name = taskDto.name;
        task.description = taskDto.description;

        await this.container.tasksRepository.update(task);

        return task;
    }

    public async searchTasks(searchTerm: string, opts: SearchOpts) {
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