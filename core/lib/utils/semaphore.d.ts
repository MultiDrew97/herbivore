/**
 * A lock that is granted when calling [[Semaphore.acquire]].
 */
type Lock = {
    release: (err?: any, rtn?: any) => void;
};
/**
 * Used to control concurrent access to a common resource.
 *
 * This implementation is used to apply a max-parallelism threshold.
 */
export declare class Semaphore {
    private label;
    private max;
    private running;
    private queue;
    constructor(label: string, max?: number);
    /**
     * Allows the next task to start, if there are any waiting.
     */
    private take;
    /**
     * Acquire a lock on the target resource.
     *
     * ! Returns a function to release the lock, it is critical that this function is called when the task is finished with the resource.
     */
    acquire: () => Promise<Lock>;
    /**
     * Releases a lock held by a task. This function is returned from the acquire function.
     */
    private release;
    /**
     * Purge all waiting tasks from the Semaphore
     */
    purge: () => void;
}
/**
 * Used to lock down a resource to prevent race conditions
 */
export declare class Mutex {
    private static locked;
    /**
     * Checks whether the mutex is locked
     */
    private static get isLocked();
    /**
     * Locks the mutex, so that the resource can be reserved
     */
    static lock(): Promise<void>;
    /**
     * Unlocks the mutex, allowing resources to be used
     */
    static unlock(): void;
}
export {};
