import { OptionsJson, OptionsUrlencoded } from 'body-parser'
import express, { Express, json, NextFunction, Request, Response, urlencoded } from 'express'
import helmet, { HelmetOptions } from 'helmet'
import { constants } from 'http2'
import { clone, merge } from 'lodash'
import { RegisterControllers } from './routes'

/** The type of classes that can be used as a controller for the API backend */
export type ControllerClass = InstanceType<any>

export type ExpressRouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>
export type ErrorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => void | Promise<void>

export type AuthenticationMiddleware = ExpressRouteHandler
export type NotFoundMiddleware = ExpressRouteHandler

export type HerbAPIConfig = Partial<{
	json: boolean
	jsonConfig: OptionsJson
	urlEncoding: boolean
	urlEncodingConfig: OptionsUrlencoded
	helmetConfig: HelmetOptions
	authenticator: AuthenticationMiddleware
	notFoundHandler: NotFoundMiddleware
	errorHandler: ErrorHandlerMiddleware
	preRouteMiddleware: Array<ExpressRouteHandler>
	paths: Array<ControllerClass>
	postRouteMiddleware: Array<ExpressRouteHandler>
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
		res.status(constants.HTTP_STATUS_NOT_FOUND).json({
			message: 'NOT_FOUND_BUDDY',
		})
	},
	errorHandler: (err, _, res) => {
		res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(err)
	},
})

export function createHerbAPI(cfg?: HerbAPIConfig): Express {
	const api: Express = express()
	const config: HerbAPIConfig = clone(DEFAULT_API_CONFIG)

	/*
	TODO: Scalability

	Update so that the provided config is deeply copied to overwrite any values that are not undefined in the provided config

	- Use lodash?
	- Use Pure ts?
	*/
	console.debug('Before Merge: ', config)
	cfg && merge(config, cfg)
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
