import { isEmpty } from 'lodash'
import { Md5 } from 'ts-md5'
import { ArgumentError } from '@utils/errors'

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
 * Format a string of numbers to be in a phone format of (###) ###-#### x###
 * @param phone The phone number to format
 * @param ext The optional ext for the provided phone number
 * @returns
 *
 * @throws ArgumentError
 */
export function formatPhone(phone: string, ext?: string): string {
	phone = phone.trim().replaceAll(/\D/g, '')

	if (isEmpty(phone)) return ''
	if (phone.length < 10) throw new ArgumentError('Invalid length')

	console.debug(phone)

	if (/[^\d+]/i.test(phone)) throw new ArgumentError('Invalid characters')

	const matches = /(?<area>\d{3})(?<first>\d{3})(?<last>\d{4})/g.exec(phone)

	if (!matches || !matches.groups) throw new ArgumentError('Invalid phone number provided')

	return `(${matches.groups['area']}) ${matches.groups['first']}-${matches.groups['last']} ${
		ext ? `x${ext}` : ''
	}`.trim()
}
