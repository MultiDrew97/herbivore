// Contains custom matchers and Jest customizations
import { type AxiosResponse } from 'axios'

declare global {
	namespace jest {
		interface Matchers<R> {
			toMatchResponse<T extends AxiosResponse = AxiosResponse>(expected: Partial<T>): R
		}
	}
}
