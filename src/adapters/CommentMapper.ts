import short from "short-uuid";
import { CommentDto } from "../dto/CommentDto.js";
import { Comment } from "../model/Comment.js";

import { Mapper } from "./Mapper.js";
import { COMMENT_REASON } from "../enums/CommentReason.js";

export class CommentMapper implements Mapper<CommentDto, Comment> {
    public toModel(input: CommentDto): Comment {
        return {
            id: input.id || short.generate(),
            text: input.text,
            createdAt: input.createdAt?.toISOString() || new Date().toISOString(),
            reason: input.reason || COMMENT_REASON.USER_COMMENT
        }
    }
    public toDto(input: Comment): CommentDto {
        return {
            id: input.id,
            text: input.text,
            createdAt: new Date(input.createdAt),
            reason: input.reason
        }
    }

}