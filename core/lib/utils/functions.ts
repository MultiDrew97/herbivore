import { isEmpty } from 'lodash'
import { Md5 } from 'ts-md5'
import { ArgumentError } from './errors'

/**
 * Encrypt a given string value using the provided salt value
 * @param value The plain text to encrypt
 * @param salt The salt for the encryption, any
 */
export function encrypt(value: string, salt?: string): string {
	// FIXME: Replace encryption with sha256
	return Md5.hashStr(`${value}${salt}`)
}

/**
 * A promise that resolves in `ms` milliseconds.
 *
 * Useful when needing to wait for something asyncronously
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Format a string of numbers to be in a phone format
 * @param phone The phone number to format
 * @returns
 */
export function formatPhone(phone: string, ext?: string): string {
	phone = phone.trim()
	phone = phone.replaceAll(/[()\s+-]/gi, '')
	console.debug(phone)

	if (isEmpty(phone)) return ''
	if (phone.length < 10) throw new ArgumentError('Invalid length')
	if (/[^\d+]/i.test(phone)) throw new ArgumentError('Invalid characters')

	return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)} ${(ext ? `x${ext}` : '')}`.trim()
}
