"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPhone = exports.wait = exports.encrypt = void 0;
const lodash_1 = require("lodash");
const ts_md5_1 = require("ts-md5");
const errors_1 = require("./errors");
/**
 * Encrypt a given string value using the provided salt value
 * @param value The plain text to encrypt
 * @param salt The salt for the encryption, any
 */
function encrypt(value, salt) {
    // FIXME: Replace encryption with sha256
    return ts_md5_1.Md5.hashStr(`${value}${salt}`);
}
exports.encrypt = encrypt;
/**
 * A promise that resolves in `ms` milliseconds.
 *
 * Useful when needing to wait for something asyncronously
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.wait = wait;
/**
 * Format a string of numbers to be in a phone format of (###) ###-#### x###...
 * @param phone The phone number to format
 * @returns
 */
function formatPhone(phone, ext) {
    phone = phone.trim();
    if ((0, lodash_1.isEmpty)(phone))
        return '';
    if (phone.length < 10)
        throw new errors_1.ArgumentError('Invalid length');
    phone = phone.replaceAll(/[()\s+-]/gi, '');
    console.debug(phone);
    if (/[^\d+]/i.test(phone))
        throw new errors_1.ArgumentError('Invalid characters');
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)} ${ext ? `x${ext}` : ''}`.trim();
}
exports.formatPhone = formatPhone;
