/**
 * Module that contains all time based conversion logic
 */
export namespace Time {
	export function fromSeconds(sec: number) {
		return sec * 1000
	}

	export function fromMinutes(min: number) {
		return fromSeconds(min) * 60
	}

	export function fromHours(hrs: number) {
		return fromMinutes(hrs) * 60
	}

	export function fromDays(days: number) {
		return fromHours(days) * 24
	}
}
