import 'reflect-metadata'

import { type ControllerClass } from '@src'
import { type RequestHandler, type RequestParamHandler, Router, type RouterOptions } from 'express'

export const PREFIX = Symbol('prefix')
export const ROUTES = Symbol('routes')
export const ROUTE_OPTIONS = Symbol('route_options')

/*
MAYBE: Sclabaility

Update this so that:

	[ ] 'use' is swapped with pre
	  	- Does 'all' get removed too?
		- Leave 'all' as a valid option for the proper all handling?
  	[x] Implement so that the pre hooks are registered in before normal endpoint registration
	[ ] Test the pre hook is firing properly
	   	-
 */
/** The available methods that can be used for registration */
type Method = 'get' | 'post' | 'delete' | 'put' | 'options' | 'patch' | 'param' | 'all'

/** The internal config for how the routes are defined */
type RouteConfig = {
	/** The method the route is handling */
	method: Method
	/** What path to handle on */
	path: string
	/** The name or symbol of the function that was marked to handle the route */
	handler: string | symbol
}
/*
FIXME: Config

Determine the best info to use for the configuration of the child routes when
*/
export type ControllerChild = {
	/** The path for the child route */
	path: string
	/** The controller to use for the child route */
	controller: ControllerClass
}
export type ControllerOptions = RouterOptions & {
	/** The handlers to run before your routes and children */
	preRoute?: Array<RequestHandler>
	/**
	 * The children for the controller. This opens up setting up subpaths (i.e. /api/sub/path)
	 */
	children?: Array<ControllerChild> | ControllerClass
}

/**
 * A class decorator for marking a class for being an API controller
 * @param pfx The route prefix
 * @param opts The setup options to use for the route controller being made
 * @returns
 *
 * @see {@link RouterOptions}
 */
export function Controller(pfx: string, opts?: ControllerOptions): ClassDecorator {
	console.info(`Defining controller for ${pfx}...`)
	return (target: ControllerClass) => {
		console.info(`Defining controller for '${pfx}'...`)
		Reflect.defineMetadata(PREFIX, pfx, target)
		Reflect.defineMetadata(ROUTE_OPTIONS, opts, target)
		console.info(`'${pfx}' controller has been defined`)
		return target
	}
}

type RouteHandler<M extends Method> = M extends 'param' ? RequestParamHandler : RequestHandler

/**
 * A method decorator for a route handler. Must be used within a Controller marked class
 * @param method The method this method will handle
 * @param path The path the route is for
 * @returns
 */
export function Route<M extends Method>(method: M, path: string) {
	return <T extends RouteHandler<M>>(
		target: ControllerClass,
		handler: symbol | string,
		_desc: TypedPropertyDescriptor<T>,
	) => {
		const ctor = target.constructor
		/*
			FIXME: Scalability

			Add verification that the Route decorator is being used on a function within a class that was marked to be a controller
		*/
		// if (!Reflect.getMetadata(PREFIX, ctor))
		// 	throw new ConfigError('Must be used within a class marked to be a controller')

		console.info(`Defining endpoint ${method.toUpperCase()} ${path}...`)
		/*
		MAYBE: Verification

		Verifiy that this has to be target.constructor and there is no way to have it as target only
		*/
		const routes: RouteConfig[] = Reflect.getMetadata(ROUTES, ctor) ?? []
		routes.push({ method, path, handler })
		Reflect.defineMetadata(ROUTES, routes, ctor)
	}
}

type RouteDefinition = { path: string; router: Router }
/**
 * Convert a provided controller class constructor into an ExpressJS router object
 *
 *
 * @param controller The controller to convert to a router
 * @returns An object that holds the path for the router and the router object that pertains to this
 *
 * @see {@link ControllerClass}
 */
function getExpressRouter(controller: ControllerClass): RouteDefinition {
	const pfx: string = Reflect.getMetadata(PREFIX, controller)
	const ctrl = new controller()
	const { children, preRoute: pre, ...opts }: ControllerOptions = Reflect.getMetadata(ROUTE_OPTIONS, controller) ?? {}
	const rts: RouteConfig[] = Reflect.getMetadata(ROUTES, controller) ?? []
	const rtr = Router(opts)

	console.info(`Registering '${pfx}' with ${rts.length} endpoints...`)
	console.debug(rts)

	// Load any provided pre-route middleware
	console.debug('Number of Pre-Route Middleware: ', pre?.length ?? 0)
	pre?.forEach((p) => rtr.use(p))

	/*
	 Load the all methods for the route

	 Start with 'all' methods so that they can be ran first
	 */
	rts?.forEach(({ method, path, handler }) => {
		console.info(`Mounting endpoint ${method.toUpperCase()} '${path}' for '${pfx}'...`)
		switch (method) {
			case 'param':
				rtr[method](path, ctrl[handler].bind(ctrl) as RequestParamHandler)
				break
			default:
				rtr[method](path, ctrl[handler].bind(ctrl) as RequestHandler)
		}
	})

	// Load any provided chilren routers first
	console.debug('Number of Children: ', children?.length ?? 0)
	children?.forEach((child: ControllerChild | ControllerClass) => {
		const cls: boolean = 'path' in child
		let info = getExpressRouter(cls ? child.controller : child)
		/*
			FIXME: Configuration

				[x] Parse through children to add them in below pattern:

			*/
		console.debug(info)
		console.debug(cls ? child.path : info.path)
		rtr.use(cls ? child.path : info.path, info.router)
	})
	return { path: pfx, router: rtr }
}

/**
 *	Register all the provided controllers with the express api backend
 * @param controllers The list of controllers to register for the application
 * @returns The list of router objects with their prefixes created from the provided controllers
 *
 * @see {@link ControllerClass}
 */
export function RegisterControllers(...controllers: Array<ControllerClass>) {
	console.info(`Registering ${controllers.length} controller(s)...`)

	return controllers.map(getExpressRouter)
}
