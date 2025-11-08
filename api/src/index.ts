import { AuthenticationError, CustomError } from '@herbivore/core/utils/errors'
import { OptionsJson, OptionsUrlencoded } from 'body-parser'
import express, {
	ErrorRequestHandler,
	Express,
	json,
	NextFunction,
	Request,
	RequestHandler,
	Response,
	urlencoded,
} from 'express'
import helmet, { HelmetOptions } from 'helmet'
import { constants } from 'http2'
import { merge } from 'lodash'
import { RegisterControllers } from '@src/routes'

export class ConfigError extends CustomError {}

/** The type of classes that can be used as a controller for the API backend */
export type ControllerClass = InstanceType<any>

/** The type of function that can be a route handler */
// export type ExpressRouteHandler = RequestHandler
/** The type of function that can be an error handler */
// export type ErrorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => void | Promise<void>
// export type RouteParamHandler = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction,
// 	param: string,
// 	paramName: string
// ) => void | Promise<void>

/** The type of function that can be an authentication handler */
export type AuthenticationMiddleware = RequestHandler
/** The type of function that can be a not found handler */
export type NotFoundMiddleware = RequestHandler

/**
 * The config for creating a new API
 *
 * All
 */
export type HerbAPIConfig = Partial<{
	json: boolean
	jsonConfig: OptionsJson
	urlEncoding: boolean
	urlEncodingConfig: OptionsUrlencoded
	helmetConfig: HelmetOptions
	authenticator: AuthenticationMiddleware
	notFoundHandler: NotFoundMiddleware
	errorHandler: ErrorRequestHandler
	preRouteMiddleware: Array<RequestHandler>
	paths: Array<ControllerClass>
	postRouteMiddleware: Array<RequestHandler>
}>

const DEFAULT_HELMET_CONFIG: HelmetOptions = Object.freeze({
	hidePoweredBy: true,
})
const DEFAULT_JSON_CONFIG: OptionsJson = Object.freeze({})
const DEFAULT_URL_ENCONDING_CONFIG: OptionsUrlencoded = Object.freeze({
	extended: true,
})
const DEFAULT_API_CONFIG: HerbAPIConfig = Object.freeze({
	helmetConfig: DEFAULT_HELMET_CONFIG,
	json: true,
	jsonConfig: DEFAULT_JSON_CONFIG,
	urlEncoding: true,
	urlEncodingConfig: DEFAULT_URL_ENCONDING_CONFIG,
	notFoundHandler: (_, res) => {
		console.debug('Not Found Hit')
		res.status(constants.HTTP_STATUS_NOT_FOUND).json({
			message: 'Not sure where that is, brother ☹️',
		})
	},
	errorHandler: (err, _req, res, _next) => {
		let code = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
		let message = err.message ?? 'Unknown error occured'

		switch (true) {
			case err instanceof AuthenticationError:
				code = constants.HTTP_STATUS_UNAUTHORIZED
				break
		}

		res.status(code).json({ message, cause: err })
	},
})

/**
 * Create a new express based API app using a provided configuration.
 *
 * The provided config will be deeply merged with the default config of the package
 *
 * @param cfg The config for the API
 * @returns The express app created from the provided config
 *
 * @see {@link HerbAPIConfig}
 *
 * @throws ConfigError
 */
export function createHerbAPI(cfg?: HerbAPIConfig): Express {
	const api: Express = express()
	const config: HerbAPIConfig = { ...DEFAULT_API_CONFIG }

	/*
	TODO: Scalability

	Update so that the provided config is deeply copied to overwrite any values that are not undefined in the provided config

	- Use lodash?
	- Use Pure ts?
	*/
	console.debug('Before Merge: ', config)
	merge(config, cfg)
	console.debug('After Merge: ', config)

	api.use(helmet(config.helmetConfig))

	config.json && api.use(json(config.jsonConfig))

	config.urlEncoding && api.use(urlencoded(config.urlEncodingConfig))

	config.authenticator && api.use(config.authenticator)

	config.preRouteMiddleware?.forEach((pre) => api.use(pre))

	config.paths && RegisterControllers(...config.paths).forEach(({ path: pfx, router: rtr }) => api.use(pfx, rtr))

	config.postRouteMiddleware?.forEach((post) => api.use(post))

	config.notFoundHandler && api.use(config.notFoundHandler)

	config.errorHandler && api.use(config.errorHandler)

	return api
}
