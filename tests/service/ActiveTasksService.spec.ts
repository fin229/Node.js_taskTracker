/* eslint-disable @typescript-eslint/no-explicit-any */

import Sinon from "sinon";

import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import { ActiveTasksService } from "../../src/service/ActiveTasksService";
import { TasksRepository } from "../../src/repository/TasksRepository";
import { TASK_STATUS } from "../../src/enums/TaskStatus";


describe("validators#ActiveTasksService", () => {
    const sandbox = Sinon.createSandbox();
    const tasksRepositoryStub = sandbox.createStubInstance(TasksRepository);

    const testClass = new ActiveTasksService({ tasksRepository: tasksRepositoryStub });

    beforeEach(() => {
        sandbox.reset();
    });

    describe("setActiveTask", () => {
        it("should set the active task to active if no active task exist and the task is open", async () => {
            tasksRepositoryStub.getById.resolves({ id: "1", state: TASK_STATUS.OPEN } as any);
            const result = await testClass.setActiveTask("1");

            const { startedAt } = tasksRepositoryStub.update.args[0][0];

            assert.equal(result.id, "1");
            assert.equal(result.state, TASK_STATUS.IN_PROGRESS);
            assert.equal(result.startedAt, startedAt);

            assert(tasksRepositoryStub.setActiveTaskId.calledOnceWith("1"), "setActiveTaskId was not called once");
            assert(tasksRepositoryStub.update.calledOnceWith({ id: "1", state: TASK_STATUS.IN_PROGRESS, startedAt: Sinon.match.string }), "update was not called with the expected properties");
            assert(tasksRepositoryStub.getById.calledOnceWith("1"), "Get called by id was not called with the proper value or at all");
        });

        it("should fail if there is already an active task", async () => {
            tasksRepositoryStub.getActiveTaskId.resolves("1");

            assert(tasksRepositoryStub.update.notCalled, "update was called");
            assert(tasksRepositoryStub.setActiveTaskId.notCalled, "setActiveTaskId was called");

            await assert.isRejected(testClass.setActiveTask("1"), "There is already an active task");
        });

        it("should fail if the task selected is not open", async () => {
            tasksRepositoryStub.getById.resolves({ id: "1", state: TASK_STATUS.DONE } as any);

            assert(tasksRepositoryStub.update.notCalled, "update was called");
            assert(tasksRepositoryStub.setActiveTaskId.notCalled, "setActiveTaskId was called");

            await assert.isRejected(testClass.setActiveTask("1"), "Task is done, cannot be modified");
        });

        it("should fail if the task selected does not exist", async () => {
            tasksRepositoryStub.getById.resolves(undefined);

            assert(tasksRepositoryStub.update.notCalled, "update was called");
            assert(tasksRepositoryStub.setActiveTaskId.notCalled, "setActiveTaskId was called");

            await assert.isRejected(testClass.setActiveTask("1"), "Task does not exist");
        });
    });
});
