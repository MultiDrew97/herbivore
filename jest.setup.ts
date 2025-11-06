import './jest.d' // Contains custom matchers and Jest customizations

import { AxiosResponse } from 'axios'
import { checkCirculars } from './jest.helpers'

expect.extend({
	async toMatchResponse<T extends AxiosResponse = AxiosResponse>(
		this: jest.MatcherContext,
		res: T,
		exp: T
	): Promise<jest.CustomMatcherResult> {
		const { printReceived, printExpected, matcherHint } = this.utils
		let pass: boolean
		// const pass: boolean = (Object.keys(expected) as (keyof T)[]).every((k) => k in res && res[k] === expected[k])
		if (res === undefined) {
			pass = exp === undefined

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
		pass = (Object.keys(exp) as (keyof T)[]).filter((k) => !this.equals(res[k], exp[k])).length === 0
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
