"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = exports.Semaphore = void 0;
const os_1 = require("os");
const functions_1 = require("./functions");
/**
 * Used to control concurrent access to a common resource.
 *
 * This implementation is used to apply a max-parallelism threshold.
 */
class Semaphore {
    label;
    max;
    running = 0;
    queue = [];
    constructor(label, max = (0, os_1.cpus)().length) {
        this.label = label;
        this.max = max;
        if (max < 1) {
            throw new Error(`The ${label} semaphore was created with a max value of ${max} but the max value cannot be less than 1`);
        }
    }
    /**
     * Allows the next task to start, if there are any waiting.
     */
    take = () => {
        if (this.queue.length > 0 && this.running < this.max) {
            this.running++;
            // Get the next task from the queue
            const task = this.queue.shift();
            // Resolve the promise to allow it to start, provide a release function
            task?.resolve({ release: this.release });
        }
    };
    /**
     * Acquire a lock on the target resource.
     *
     * ! Returns a function to release the lock, it is critical that this function is called when the task is finished with the resource.
     */
    acquire = () => {
        console.debug(`Lock requested for the ${this.label} resource - ${this.running} active, ${this.queue.length} waiting`);
        if (this.running < this.max) {
            this.running++;
            return Promise.resolve({ release: this.release });
        }
        console.debug(`Max active locks hit for the ${this.label} resource - there are ${this.running} tasks running and ${this.queue.length} in queue.`);
        return new Promise((resolve, reject) => {
            this.queue.push({ resolve, reject });
        });
    };
    /**
     * Releases a lock held by a task. This function is returned from the acquire function.
     */
    release = () => {
        this.running--;
        this.take();
    };
    /**
     * Purge all waiting tasks from the Semaphore
     */
    purge = () => {
        console.debug(`Purge requested on the ${this.label} semaphore, ${this.queue.length} pending tasks will be cancelled.`);
        this.queue.forEach((task) => {
            task.reject(new Error('The semaphore was purged and as a result this task has been cancelled'));
        });
        this.running = 0;
        this.queue = [];
    };
}
exports.Semaphore = Semaphore;
/**
 * Used to lock down a resource to prevent race conditions
 */
class Mutex {
    static locked;
    /**
     * Checks whether the mutex is locked
     */
    static get isLocked() {
        return this.locked;
    }
    /**
     * Locks the mutex, so that the resource can be reserved
     */
    static async lock() {
        while (this.isLocked) {
            await (0, functions_1.wait)(1000);
        }
        this.locked = true;
    }
    /**
     * Unlocks the mutex, allowing resources to be used
     */
    static unlock() {
        this.locked = false;
    }
}
exports.Mutex = Mutex;
