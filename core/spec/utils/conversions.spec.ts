import { Time } from '@utils/conversions'

describe('Conversions', () => {
	test('Time', () => {
		expect(Time.fromSeconds(1)).toBe(1000)
		expect(Time.fromMinutes(1)).toBe(60000)
		expect(Time.fromHours(1)).toBe(3600000)
		expect(Time.fromDays(1)).toBe(3600000 * 24)
		expect(Time.fromSeconds(0.5)).toBe(500)
		expect(Time.fromMinutes(0.5)).toBe(30000)
		expect(Time.fromHours(0.5)).toBe(1800000)
		expect(Time.fromDays(0.5)).toBe(1800000 * 24)
	})
})
