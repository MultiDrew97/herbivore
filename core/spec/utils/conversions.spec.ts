import { Time } from '@src/utils/conversions'

describe('Conversions', () => {
	test('Time', () => {
		expect(Time.fromSeconds(1)).toBe(1000)
		expect(Time.fromMinutes(1)).toBe(60000)
		expect(Time.fromHours(1)).toBe(3600000)
		expect(Time.fromDays(1)).toBe(3600000 * 24)
	})
})
