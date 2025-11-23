// Contains custom matchers and Vitest customizations
import 'vitest'
import { type AxiosResponse } from 'axios'

interface CustomMatchers<R = unknown> {
	toMatchResponse<T extends AxiosResponse = AxiosResponse>(expected: Partial<T>): R
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
