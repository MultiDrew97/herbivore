import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { merge } from 'lodash'

export const DEFAULT_PORT: number = 3000
export const DEFAULT_HOST: string = 'localhost'
export const DEFAULT_BASE_URL: string = `http://${DEFAULT_HOST}:${DEFAULT_PORT}/api`
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
		vitest.spyOn(console, t).mockImplementation(noop)
	})
}

type WaitOptions = {
	timeout: number
	interval: number
}

/** Custom wait for function for when the vitest global version isn't available. Usually from the global setup files */
export async function waitFor(fn: () => Promise<void> | void, opts?: Partial<WaitOptions>) {
	return await new Promise<void>((res) => {
		const timer = setInterval(() => {
			try {
				fn()

				clearInterval(timer)
				res()
			} catch (err: any) {
				console.error(err.message)
			}
		}, opts?.interval ?? 1000)
	})
}
