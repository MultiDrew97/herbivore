"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAGS = void 0;
const DEFAULT_HEADING = '[APP]';
const DEFAULT_SHOW_DATE = true;
var TAGS;
(function (TAGS) {
    TAGS["log"] = "[LOG]";
    TAGS["info"] = "[INFO]";
    TAGS["warn"] = "[WARN]";
    TAGS["error"] = "[ERROR]";
    TAGS["debug"] = "[DEBUG]";
    TAGS["trace"] = "[TRACE]";
})(TAGS = exports.TAGS || (exports.TAGS = {}));
function parseHeading(heading) {
    if (heading === undefined || heading === '' || heading === DEFAULT_HEADING)
        return DEFAULT_HEADING;
    heading = heading.replaceAll(/[^\da-zA-Z]/g, '').trim();
    return heading && !/\[.+\]/i.test(heading) ? `[${heading}]` : DEFAULT_HEADING;
}
/**
 * Creates a logger object to handle logging to any console
 */
class Logger {
    heading;
    showDate;
    constructor(heading = DEFAULT_HEADING, showDate = DEFAULT_SHOW_DATE) {
        this.heading = heading;
        this.showDate = showDate;
        this.heading = parseHeading(this.heading);
    }
    /**
     * Prints a message using the log channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    log(message, ...data) {
        console.log(`${this.prepHeader(TAGS.log)} `, message, ...data);
    }
    /**
     * Prints a message using the info channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    info(message, ...data) {
        console.info(`${this.prepHeader(TAGS.info)} `, message, ...data);
    }
    /**
     * Prints a message using the warning channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    warn(message, ...data) {
        console.warn(`${this.prepHeader(TAGS.warn)} `, message, ...data);
    }
    /**
     * Prints a message using the error channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    error(message, ...data) {
        console.error(`${this.prepHeader(TAGS.error)} `, message, ...data);
    }
    /**
     * Prints a message using the debug channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    debug(message, ...data) {
        console.debug(`${this.prepHeader(TAGS.debug)} `, message, ...data);
    }
    /**
     * Prints a message using the trace channel
     * @param message The message to be printed
     * @param data The data to be printed
     */
    trace(message, ...data) {
        console.trace(`${this.prepHeader(TAGS.trace)} `, message, ...data);
    }
    /**
     * Gets the current date for logging
     * @private
     */
    getDate() {
        let date = new Date(Date.now());
        return `(${date.toLocaleDateString()} - ${date.toLocaleTimeString()}) `.trim();
    }
    /**
     * Preps the message to be print, gathering the date and formatting the output using the other aspects
     * @param tag The tag to use for the log
     * @private
     */
    prepHeader(tag) {
        return `${this.showDate ? this.getDate() : ''}${this.heading}${tag}`.trim();
    }
}
exports.default = Logger;
