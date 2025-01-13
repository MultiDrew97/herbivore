/**
 * The interface that houses the basic data for a DB entry
 */
export interface IDbEntry<T = string> {
    _id?: T;
    name?: string;
}
