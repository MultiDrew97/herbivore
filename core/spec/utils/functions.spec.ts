import { formatPhone } from '@utils/functions'

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

		// Test invalid characters
		expect(() => formatPhone('/*-+.!@$%^&&*^&*$fdsfjdkafbdsafiw123134321')).toThrow(/length/i)

		// Test ext placements
		const ext = '1234'
		expect(formatPhone(testPhone, ext)).toBe(`${formattedPhone} x${ext}`)
		expect(formatPhone(testPhone, ext.slice(2))).toBe(`${formattedPhone} x${ext.slice(2)}`)
		expect(formatPhone(testPhone)).toBe(formattedPhone)
		expect(formatPhone(testPhone, '')).toBe(formattedPhone)

		// MAYBE: Test for longer than 13? (i.e. (123) 456-789)
	})
})
