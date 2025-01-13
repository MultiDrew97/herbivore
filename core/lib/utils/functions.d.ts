/**
 * Encrypt a given string value using the provided salt value
 * @param value The plain text to encrypt
 * @param salt The salt for the encryption, any
 */
export declare function encrypt(value: string, salt?: string): string;
/**
 * A promise that resolves in `ms` milliseconds.
 *
 * Useful when needing to wait for something asyncronously
 */
export declare const wait: (ms: number) => Promise<unknown>;
/**
 * Format a string of numbers to be in a phone format of (###) ###-#### x###...
 * @param phone The phone number to format
 * @returns
 */
export declare function formatPhone(phone: string, ext?: string): string;
