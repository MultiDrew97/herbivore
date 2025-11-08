export * as JestModifiers from './jest.matchers.ts' // Contains custom matchers and Jest customizations

import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { merge } from 'lodash'

export const DEFAULT_PORT: number = 3000
export const DEFAULT_HOST: string = 'localhost'
export const DEFAULT_BASE_URL: string = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`
export const baseAxiosOptions: AxiosRequestConfig = {
	baseURL: DEFAULT_BASE_URL,
	headers: {
		Accept: 'application/json',
	},
}

// export function responseContaining(data: any = {}, status: number = constants.HTTP_STATUS_OK) {
// 	return expect.objectContaining({
// 		status,
// 		data: data && expect.objectContaining(data),
// 	})
// }

export async function callAPI(url: string, cfg?: AxiosRequestConfig) {
	const config = { ...baseAxiosOptions }
	merge(config, cfg)
	return await axios(url, config).catch(logError).catch(handleError)
}

/** An empty function with no output */
export function noop() {}

/**
 * A handler for logging any info about fetch errors during tests
 * @param err The err being caught
 */
function logError(err: AxiosError) {
	console.error(err.message)
	console.error(err.stack)
	console.error(err.toJSON())
	console.error(err.response?.status)
	console.error(err.response?.data)
	return Promise.reject(err)
}

/**
 * A handler for dealing with any fetch errors during tests
 * @param err The error being handled
 */
function handleError(err: AxiosError) {
	return Promise.reject(err)
}

type LogTypes = 'log' | 'debug' | 'error' | 'warn' | 'info'
export function silenceLogs(...types: LogTypes[]) {
	/*
	FIXME: Scalablility

	Resolve so that this ensures that each one only occurs once
	*/
	types.forEach((t) => {
		jest.spyOn(console, t).mockImplementation(noop)
	})
}

export function checkCirculars() {
	const seen = new WeakSet()
	return (key: string, value: any) => {
		if (value && typeof value === 'object') {
			if (seen.has(value)) {
				return '[Circular]'
			}
			seen.add(value)
		}
		return value
	}
}
