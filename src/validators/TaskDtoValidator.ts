import { TaskDto } from "../dto/TaskDto.js";

export const throwIfTaskNameAndDescriptionNotValid = (dto: TaskDto) => {
    if (dto.name.length < 3) throw new Error("Task name must be at least 3 characters long");
    if (dto.name.length > 50) throw new Error("Task name must be at most 50 characters long");

    if (dto.description && dto.description.length > 120) throw new Error("Task description must be at most 120 characters long");
}