import { ValueOf } from "../utility/ValueOf.js";

export const SEARCH_ORDER_OPTION = {
    FINSIHED_AT: "finishedAt",
    NAME: "name",
    CREATED_AT: "createdAt"
} as const;

export type SearchOrderOption = ValueOf<typeof SEARCH_ORDER_OPTION>;
export const searchOrderOptions: SearchOrderOption[] = Object.values(SEARCH_ORDER_OPTION);