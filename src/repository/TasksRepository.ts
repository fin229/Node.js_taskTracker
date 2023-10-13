import { Low } from 'lowdb';
import { Task } from '../model/Task.js';

export interface TasksDataLayout {
    tasks: Task[];
    active_task_id: string | null;
}

export const DefaultTasksDataLayout: TasksDataLayout = {
    tasks: [],
    active_task_id: null,
};

export class TasksRepository {
    constructor(private readonly db: Low<TasksDataLayout>) { }

    async getActiveTaskId(): Promise<string | null> {
        return this.db.data.active_task_id;
    }

    async setActiveTaskId(id: string | null): Promise<void> {
        this.db.data.active_task_id = id;
        await this.db.write();
    }

    async getAll(): Promise<Task[]> {
        return this.db.data.tasks;
    }

    async getById(id: string): Promise<Task | undefined> {
        return this.db.data.tasks.find((task) => task.id === id);
    }

    async create(task: Task): Promise<Task> {
        const newTask = { ...task };
        this.db.data.tasks.push(newTask);
        await this.db.write();
        return newTask;
    }

    async update(task: Task): Promise<Task> {
        const index = this.db.data.tasks.findIndex((t) => t.id === task.id);
        if (index === -1) {
            throw new Error(`Task with id ${task.id} not found`);
        }
        this.db.data.tasks[index] = task;
        await this.db.write();
        return task;
    }

    async delete(id: string): Promise<void> {
        const index = this.db.data.tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new Error(`Task with id ${id} not found`);
        }
        this.db.data.tasks.splice(index, 1);
        await this.db.write();
    }
}