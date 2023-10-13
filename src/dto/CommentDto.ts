import { CommentReason } from "../enums/CommentReason.js";

export interface CommentDto {
    id?: string;
    text: string;
    createdAt?: Date;
    reason?: CommentReason;
}