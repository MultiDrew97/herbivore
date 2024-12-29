/**
 * The interface that houses the basic data for a DB entry
 */
export interface IDbEntry<T = any> {
	id?: T
	name?: string
}
