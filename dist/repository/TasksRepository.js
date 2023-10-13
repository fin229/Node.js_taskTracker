export const DefaultTasksDataLayout = {
    tasks: [],
    active_task_id: null,
};
export class TasksRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async getActiveTaskId() {
        return this.db.data.active_task_id;
    }
    async setActiveTaskId(id) {
        this.db.data.active_task_id = id;
        await this.db.write();
    }
    async getAll() {
        return this.db.data.tasks;
    }
    async getById(id) {
        return this.db.data.tasks.find((task) => task.id === id);
    }
    async create(task) {
        const newTask = { ...task };
        this.db.data.tasks.push(newTask);
        await this.db.write();
        return newTask;
    }
    async update(task) {
        const index = this.db.data.tasks.findIndex((t) => t.id === task.id);
        if (index === -1) {
            throw new Error(`Task with id ${task.id} not found`);
        }
        this.db.data.tasks[index] = task;
        await this.db.write();
        return task;
    }
    async delete(id) {
        const index = this.db.data.tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new Error(`Task with id ${id} not found`);
        }
        this.db.data.tasks.splice(index, 1);
        await this.db.write();
    }
}
//# sourceMappingURL=TasksRepository.js.map