import { ValueOf } from "../utility/ValueOf.js";

export const COMMENT_REASON = {
    POSTPONED: "postponed",
    USER_COMMENT: "user-comment"
} as const;

export type CommentReason = ValueOf<typeof COMMENT_REASON>;
export const commentReasons: CommentReason[] = Object.values(COMMENT_REASON);