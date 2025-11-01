import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { createServer } from 'http'
import { constants } from 'http2'
import { createHerbAPI, HerbAPIConfig } from './api/src'

export const DEFAULT_PORT: number = 3000
export const DEFAULT_HOST: string = 'localhost'
export const DEFAULT_BASE_URL: string = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`
export const baseAxiosOptions: AxiosRequestConfig = {
	baseURL: DEFAULT_BASE_URL,
	timeoutErrorMessage: 'ERROR - CUSTOM TIMEOUT MESSAGE',
}

export function responseContaining(data: any, status: number = constants.HTTP_STATUS_OK) {
	return expect.objectContaining({
		status,
		data: data && expect.objectContaining(data),
	})
}

export function createTestServer(apiConfig: HerbAPIConfig, onListening?: () => void) {
	return createServer(createHerbAPI(apiConfig))
		.on('close', () => {
			console.info('Test server has been closed')
		})
		.listen(DEFAULT_PORT, DEFAULT_HOST, () => {
			console.info(`Test server listening on port ${DEFAULT_PORT}`)
			onListening && onListening()
		})
}

export async function callAxios(url: string, config: AxiosRequestConfig) {
	return await axios(url, config).catch(logFetchError).catch(handleFetchError)
}

/** An empty function with no output */
export function noop() {}

/**
 * A handler for logging any info about fetch errors during tests
 * @param err The err being caught
 */
export function logFetchError(err: AxiosError) {
	console.error(err.message)
	console.error(err.stack)
	throw err
}

/**
 * A handler for dealing with any fetch errors during tests
 * @param err The error being handled
 */
export function handleFetchError({ response, request }: AxiosError) {
	if (!response) return

	console.error(response.status)
	console.error(response.data)
	return response
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
