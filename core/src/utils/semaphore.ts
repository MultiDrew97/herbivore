import { cpus } from 'os'
import { wait } from './functions'

/**
 * A lock that is granted when calling [[Semaphore.acquire]].
 */
type Lock = {
	release: (err?: any, rtn?: any) => void
}

/**
 * A task that has been scheduled with a Semaphore but not yet started.
 */
type WaitingPromise = {
	resolve: (lock: Lock) => void
	reject: (err?: Error) => void
}

/**
 * Used to control concurrent access to a common resource.
 *
 * This implementation is used to apply a max-parallelism threshold.
 */
export class Semaphore {
	private running = 0
	private queue: WaitingPromise[] = []

	constructor(private label: string, private max: number = cpus().length) {
		if (max < 1) {
			throw new Error(
				`The ${label} semaphore was created with a max value of ${max} but the max value cannot be less than 1`
			)
		}
	}

	/**
	 * Allows the next task to start, if there are any waiting.
	 */
	private take = () => {
		if (this.queue.length > 0 && this.running < this.max) {
			this.running++

			// Get the next task from the queue
			const task = this.queue.shift()

			// Resolve the promise to allow it to start, provide a release function
			task?.resolve({ release: this.release })
		}
	}

	/**
	 * Acquire a lock on the target resource.
	 *
	 * ! Returns a function to release the lock, it is critical that this function is called when the task is finished with the resource.
	 */
	acquire = (): Promise<Lock> => {
		console.debug(
			`Lock requested for the ${this.label} resource - ${this.running} active, ${this.queue.length} waiting`
		)

		if (this.running < this.max) {
			this.running++
			return Promise.resolve({ release: this.release })
		}

		console.debug(
			`Max active locks hit for the ${this.label} resource - there are ${this.running} tasks running and ${this.queue.length} in queue.`
		)

		return new Promise<Lock>((resolve, reject) => {
			this.queue.push({ resolve, reject })
		})
	}

	/**
	 * Releases a lock held by a task. This function is returned from the acquire function.
	 */
	private release = () => {
		this.running--
		this.take()
	}

	/**
	 * Purge all waiting tasks from the Semaphore
	 */
	purge = () => {
		console.debug(
			`Purge requested on the ${this.label} semaphore, ${this.queue.length} pending tasks will be cancelled.`
		)

		this.queue.forEach((task) => {
			task.reject(new Error('The semaphore was purged and as a result this task has been cancelled'))
		})

		this.running = 0
		this.queue = []
	}
}

/**
 * Used to lock down a resource to prevent race conditions
 */
export class Mutex {
	private static locked: boolean

	/**
	 * Checks whether the mutex is locked
	 */
	private static get isLocked() {
		return this.locked
	}

	/**
	 * Locks the mutex, so that the resource can be reserved
	 */
	static async lock() {
		while (this.isLocked) {
			await wait(1000)
		}

		this.locked = true
	}

	/**
	 * Unlocks the mutex, allowing resources to be used
	 */
	static unlock() {
		this.locked = false
	}
}
