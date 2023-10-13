import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

import path from "node:path";
import os from "node:os";
import fs from "node:fs";

import { DefaultTasksDataLayout, TasksDataLayout, TasksRepository } from "./TasksRepository.js";

export interface Repositories {
    tasks?: TasksRepository;
}

export class DBManager {
    public repositories: Repositories = {};

    public constructor(private basePath: string = path.join(os.homedir(), "tm-task-tracker")) { }

    public async init() {
        this.repositories.tasks = await this.loadTasksRepository();
    }

    public async loadTasksRepository(): Promise<TasksRepository> {
        const db = await this.loadRepository<TasksDataLayout>("tasks.json", DefaultTasksDataLayout);
        return new TasksRepository(db);
    }

    private async loadRepository<T>(fileName: string, defaultLayout: T) {
        const filePath = path.join(this.basePath, fileName);

        const db = new Low<T>(new JSONFile<T>(filePath), defaultLayout);
        await this.createDbFileIfNotExists(filePath, db);

        await db.read();

        return db;
    }

    private async createDbFileIfNotExists(filePath: string, db: Low<unknown>) {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            await db.write();
        }
    }
}