export interface Mapper<I, O> {
    toModel(input: I): O;
    toDto(input: O): I;
}