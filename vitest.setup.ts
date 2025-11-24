import { type AxiosResponse } from 'axios'

interface ExpectationResult {
	pass: boolean
	message: () => string
	// If you pass these, they will automatically appear inside a diff when
	// the matcher does not pass, so you don't need to print the diff yourself
	actual?: unknown
	expected?: unknown
}

expect.extend({
	async toMatchResponse<T extends AxiosResponse = AxiosResponse>(actual: T, expected: T): Promise<ExpectationResult> {
		if (actual === undefined) {
			let pass = expected === undefined

			return {
				pass,
				message: () => (pass ? `` : ``),
			}
		}

		if (expected === undefined) {
			return {
				pass: true,
				message: () => {
					return `Matched Anything`
				},
				actual,
				expected,
			}
		}
		// const pass: boolean = this.Equals(res, expect.objectContaining(expected))
		let pass =
			(Object.keys(expected) as (keyof T)[]).filter((k) => !this.equals(actual[k], expected[k])).length === 0
		return {
			pass,
			message: () => {
				return pass ? 'Passed' : 'Failed'
			},
			actual,
			expected,
		}
	},
})
