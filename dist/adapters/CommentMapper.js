import short from "short-uuid";
import { COMMENT_REASON } from "../enums/CommentReason.js";
export class CommentMapper {
    toModel(input) {
        return {
            id: input.id || short.generate(),
            text: input.text,
            createdAt: input.createdAt?.toISOString() || new Date().toISOString(),
            reason: input.reason || COMMENT_REASON.USER_COMMENT
        };
    }
    toDto(input) {
        return {
            id: input.id,
            text: input.text,
            createdAt: new Date(input.createdAt),
            reason: input.reason
        };
    }
}
//# sourceMappingURL=CommentMapper.js.map