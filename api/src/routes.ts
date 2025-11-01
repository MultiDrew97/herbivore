import 'reflect-metadata'

import express, { RouterOptions } from 'express'
import { ExpressRouteHandler, ControllerClass } from './index'

export const PREFIX = Symbol('prefix')
export const ROUTES = Symbol('routes')
export const ROUTE_OPTIONS = Symbol('route_options')

/** The available methods that can be used for registration */
type Method = 'get' | 'post' | 'delete' | 'put' | 'options' | 'patch'
type RouteConfig = {
	method: Method
	path: string
	handler: string | symbol
}

/**
 * A class decorator for marking a class for being an API controller
 * @param pfx The route prefix
 * @param opts The setup options to use for the route controller being made
 * @returns
 *
 * @see {@link RouterOptions}
 */
export function Controller(pfx: string, opts?: RouterOptions): ClassDecorator {
	console.info(`Defining controller for ${pfx}...`)
	return (target: ControllerClass) => {
		Reflect.defineMetadata(PREFIX, pfx, target)
		Reflect.defineMetadata(ROUTE_OPTIONS, opts, target)
	}
}

/**
 * A method decorator for a route handler. Must be used within a Controller marked class
 * @param method The method this method will handle
 * @param path The path the route is for
 * @returns
 */
export function Route(method: Method, path: string): MethodDecorator {
	console.info(`Defining ${method} route for ${path}`)
	return (target: ControllerClass, handler: symbol | string, _: PropertyDescriptor) => {
		/*
		FIXME: Verification

		Verifiy that this has to be target.constructor and there is no way to have it as target only
		*/
		const routes: RouteConfig[] = Reflect.getMetadata(ROUTES, target.constructor) ?? []
		routes.push({ method, path, handler })
		Reflect.defineMetadata(ROUTES, routes, target.constructor)
	}
}

/**
 *	Register all the provided controllers with the express api backend
 * @param controllers The array of controllers to register for the application
 * @returns The array of router objects with their prefixes created from the provided controllers
 *
 * @see {@link ControllerClass}
 */
export function RegisterControllers(...controllers: ControllerClass[]) {
	console.info(`Registering ${controllers.length} controller(s)...`)
	// const app = express()

	return controllers.map((controller) => {
		const c = new controller()
		const pfx: string = Reflect.getMetadata(PREFIX, controller)
		const opts: RouterOptions = Reflect.getMetadata(ROUTE_OPTIONS, controller)
		const rts: RouteConfig[] = Reflect.getMetadata(ROUTES, controller) ?? []
		const rtr = express.Router(opts)

		console.info(`Registering '${pfx}' with ${rts.length} endpoints...`)
		console.log(rts)

		rts?.forEach(({ method, path, handler }) => {
			console.info(`Mounting endpoint '${path}' for '${pfx}'...`)
			rtr[method](path, c[handler].bind(c))
		})

		return { path: pfx, router: rtr }
		// app.use(pfx, rtr)
	})

	// return app
}
