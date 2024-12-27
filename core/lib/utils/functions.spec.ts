import { ArgumentError } from './errors'
import { formatPhone } from './functions'

describe('Functions Tests', () => {
	test('Phone Formatting', () => {
		const testPhone = '1234567890'
		const formattedPhone = '(123) 456-7890'

		// Test empty string
		expect(formatPhone('')).toBe('')

		// Test supported formatting
		expect(formatPhone(testPhone)).toBe(formattedPhone)

		// Test formatted
		expect(formatPhone(formattedPhone)).toBe(formattedPhone)

		// Test incorrect length
		expect(() => formatPhone(testPhone.slice(5))).toThrow(/length/i)

		// Test proper format, incorrect length
		expect(() => formatPhone(`(${testPhone.slice(5)}`)).toThrow(/length/i)

		// Test proper length, invalid characters
		expect(() => formatPhone('abcdefghij')).toThrow(/characters/i)

		// Test invalid characters
		expect(() => formatPhone('/*-+.!@$%^&&*^&*$fdsfjdkafbdsafiw123134321')).toThrow(/characters/i)

		// MAYBE: Test for longer than 13? (i.e. (123) 456-789)
	})
})
