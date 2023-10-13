import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { DefaultTasksDataLayout, TasksRepository } from "./TasksRepository.js";
export class DBManager {
    basePath;
    repositories = {};
    constructor(basePath = path.join(os.homedir(), "tm-task-tracker")) {
        this.basePath = basePath;
    }
    async init() {
        this.repositories.tasks = await this.loadTasksRepository();
    }
    async loadTasksRepository() {
        const db = await this.loadRepository("tasks.json", DefaultTasksDataLayout);
        return new TasksRepository(db);
    }
    async loadRepository(fileName, defaultLayout) {
        const filePath = path.join(this.basePath, fileName);
        const db = new Low(new JSONFile(filePath), defaultLayout);
        await this.createDbFileIfNotExists(filePath, db);
        await db.read();
        return db;
    }
    async createDbFileIfNotExists(filePath, db) {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            await db.write();
        }
    }
}
//# sourceMappingURL=DBManager.js.map