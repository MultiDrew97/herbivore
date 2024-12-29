export declare enum TAGS {
    log = "[LOG]",
    info = "[INFO]",
    warn = "[WARN]",
    error = "[ERROR]",
    debug = "[DEBUG]",
    trace = "[TRACE]"
}
/**
 * Creates a logger object to handle logging to any console
 */
export default class Logger {
    private readonly heading;
    private readonly showDate;
    constructor(heading?: string, showDate?: boolean);
    /**
     * Prints a message using the log channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    log(message?: any, ...data: any[]): void;
    /**
     * Prints a message using the info channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    info(message?: any, ...data: any[]): void;
    /**
     * Prints a message using the warning channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    warn(message?: any, ...data: any[]): void;
    /**
     * Prints a message using the error channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    error(message?: any, ...data: any[]): void;
    /**
     * Prints a message using the debug channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    debug(message?: any, ...data: any[]): void;
    /**
     * Prints a message using the trace channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    trace(message?: any, ...data: any[]): void;
    /**
     * Gets the current date for logging
     * @private
     */
    private getDate;
    /**
     * Preps the message to be print, gathering the date and formatting the output using the other aspects
     * @param tag The tag to use for the log
     * @private
     */
    private prepHeader;
}
