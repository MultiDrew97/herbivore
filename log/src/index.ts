const DEFAULT_HEADING: string = '[APP]'
const DEFAULT_SHOW_DATE: boolean = true

export enum TAGS {
	log = '[LOG]',
	info = '[INFO]',
	warn = '[WARN]',
	error = '[ERROR]',
	debug = '[DEBUG]',
	trace = '[TRACE]',
}

function parseHeading(heading: string): string {
	if (!heading || heading === '' || heading === DEFAULT_HEADING) return DEFAULT_HEADING

	heading = heading.replaceAll(/[^\da-zA-Z]/g, '').trim()

	return !/\[.+\]/i.test(heading) ? `[${heading}]` : DEFAULT_HEADING
}
/*
MAYBE: Feature

Add in formatting

Also make it so a custom filter can be passed
*/

/**
 * Creates a logger object to handle logging to any console
 */
export default class Logger {
	/**
	 *
	 * @param heading The heading to use for the logger object
	 * @param showDate Whether to include the date in the log
	 */
	constructor(
		private readonly heading: string = DEFAULT_HEADING,
		private readonly showDate: boolean = DEFAULT_SHOW_DATE
	) {
		this.heading = parseHeading(this.heading)
	}

	/**
	 * Prints a message using the log channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	log(message?: any, ...data: any[]): void {
		console.log(`${this.prepHeader(TAGS.log)} `, message, ...data)
	}

	/**
	 * Prints a message using the info channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	info(message?: any, ...data: any[]): void {
		console.info(`${this.prepHeader(TAGS.info)} `, message, ...data)
	}

	/**
	 * Prints a message using the warning channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	warn(message?: any, ...data: any[]): void {
		console.warn(`${this.prepHeader(TAGS.warn)} `, message, ...data)
	}

	/**
	 * Prints a message using the error channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	error(message?: any, ...data: any[]): void {
		console.error(`${this.prepHeader(TAGS.error)} `, message, ...data)
	}

	/**
	 * Prints a message using the debug channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	debug(message?: any, ...data: any[]): void {
		console.debug(`${this.prepHeader(TAGS.debug)} `, message, ...data)
	}

	/**
	 * Prints a message using the trace channel
	 * @param message The message to be printed
	 * @param data The data to be printed
	 */
	trace(message?: any, ...data: any[]): void {
		console.trace(`${this.prepHeader(TAGS.trace)} `, message, ...data)
	}

	/**
	 * Gets the current date for logging
	 * @private
	 */
	private getDate(): string {
		let date = new Date(Date.now())
		return `(${date.toLocaleDateString()} - ${date.toLocaleTimeString()}) `.trim()
	}

	/**
	 * Preps the message to be print, gathering the date and formatting the output using the other aspects
	 * @param tag The tag to use for the log
	 * @private
	 */
	private prepHeader(tag: TAGS): string {
		return `${this.showDate ? this.getDate() : ''}${this.heading}${tag}`.trim()
	}
}
