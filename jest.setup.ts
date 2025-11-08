import '@base/matchers'

import { type AxiosResponse } from 'axios'

expect.extend({
	async toMatchResponse<T extends AxiosResponse = AxiosResponse>(
		this: jest.MatcherContext,
		res: T,
		exp: T
	): Promise<jest.CustomMatcherResult> {
		const { printReceived, printExpected, matcherHint } = this.utils

		if (res === undefined) {
			let pass = exp === undefined

			return {
				pass,
				message: () => (pass ? `` : ``),
			}
		}

		if (exp === undefined) {
			return {
				pass: true,
				message: () => {
					return `${matcherHint('.toMatchResponse')} got a response but no expected to match against`
				},
			}
		}
		// const pass: boolean = this.Equals(res, expect.objectContaining(expected))
		let pass = (Object.keys(exp) as (keyof T)[]).filter((k) => !this.equals(res[k], exp[k])).length === 0
		return {
			pass,
			message: () => {
				return pass
					? `${matcherHint('.not.toMatchResponse')} expected res to *not* match:\nReceived: ${printReceived(
							res
					  )}`
					: `${matcherHint('.toMatchResponse')} expected res to match partial:\nReceived: ${printReceived(
							res
					  )}\nExpected: ${printExpected(exp)}`
			},
		}
	},
})
