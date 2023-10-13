import { CommentReason } from "../enums/CommentReason.js";

export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    reason: CommentReason
}