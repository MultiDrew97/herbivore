const DEFAULT_HEADING: string = "[APP]"
const DEFAULT_DATE: boolean = true

// let heading: string
// let showDate: boolean

export const TAGS = {
	log: "[LOG]",
	info: "[INFO]",
	warn: "[WARN]",
	error: "[ERROR]",
	debug: "[DEBUG]",
	trace: "[TRACE]"
}

/**
 * Creates a logger object to handle logging to any console
 */
export default class Logger {
	readonly desiredHeading: string
	readonly showDate: boolean

	constructor(heading?: string, date?: boolean) {
		this.desiredHeading = (heading && !/\[.+\]/i.test(heading)) ? `[${heading}]` :
			this.desiredHeading = heading ?? DEFAULT_HEADING

		this.showDate = date ?? DEFAULT_DATE
	}

	/**
	 * Prints a message using the log channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	log(message?: any, ...data: any[]): void {
		console.log(`${this.prepHeader(TAGS.log)}`, message, ...data)
	}

	/**
	 * Prints a message using the info channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	info(message?: any, ...data: any[]): void {
		console.info(`${this.prepHeader(TAGS.info)}`, message, ...data)
	}

	/**
	 * Prints a message using the warning channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	warn(message?: any, ...data: any[]): void {
		console.warn(`${this.prepHeader(TAGS.warn)}`, message, ...data)
	}

	/**
	 * Prints a message using the error channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	error(message?: any, ...data: any[]): void {
		console.error(`${this.prepHeader(TAGS.error)}`, message, ...data)
	}

	/**
	 * Prints a message using the debug channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	debug(message?: any, ...data: any[]): void {
		console.debug(`${this.prepHeader(TAGS.debug)}`, message, ...data)
	}

	/**
	 * Prints a message using the trace channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	trace(message?: any, ...data: any[]): void {
		console.trace(`${this.prepHeader(TAGS.trace)}`, message, ...data)
	}

	/**
	 * Gets the current date for logging
	 * @private
	 */
	private getDate(): string {
		let date = new Date(Date.now())
		return `(${date.toLocaleDateString()} - ${date.toLocaleTimeString()}) `
	}

	/**
	 * Preps the message to be print, gathering the date and formatting the output using the other aspects
	 * @param tag The tag to use for the log
	 * @private
	 */
	private prepHeader(tag: string): string {
		return `${this.showDate ? this.getDate() : ""}${this.desiredHeading}${tag}`
	}
}

/*export function init(heading?: string, date?: boolean) {
	heading = heading ?? DEFAULT_HEADING
	showDate = date ?? DEFAULT_DATE
}

export function log(heading: string, message?: any, date?: boolean, ...data: any[]) {
	console.log(`%s`, prepMessage(heading, TAGS.log, message), ...data)
}

export function info(heading: string, message?: any, date?: boolean, ...data: any[]) {
	console.info(`%s`, prepMessage(heading, TAGS.info, message), ...data)
}

export function warn(heading: string, message?: any, date?: boolean, ...data: any[]) {
	console.warn(`%s`, prepMessage(heading, TAGS.warn, message), ...data)
}

export function error(heading: string, message?: any, date?: boolean, ...data: any[]) {
	console.error(`%s`, prepMessage(heading, TAGS.error, message), ...data)
}

export function debug(heading: string, message?: any, date?: boolean, ...data: any[]) {
	console.debug(`%s`, prepMessage(heading, TAGS.debug, message), ...data)
}

export function trace(heading: string, message?: any, date?: boolean, ...data: any[]) {
	console.trace(`%s`, prepMessage(heading, TAGS.trace, message), ...data)
}

function getDate() {
	let date = (new Date(Date.now()))
	return `(${date.toDateString()}) `
}

function prepMessage(heading: string, tag: string, message: string) {
	return `${showDate ? getDate() : ""}${heading}${tag} ${message}`
}*/
