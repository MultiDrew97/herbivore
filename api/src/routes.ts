import 'reflect-metadata'

import express, { RequestHandler, RequestParamHandler, RouterOptions } from 'express'
import { ControllerClass } from '@src'

export const PREFIX = Symbol('prefix')
export const ROUTES = Symbol('routes')
export const ROUTE_OPTIONS = Symbol('route_options')

/** The available methods that can be used for registration */
type Method = 'get' | 'post' | 'delete' | 'put' | 'options' | 'patch' | 'param'

/** The internal config for how the routes are defined */
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
		console.info(`Defining controller for '${pfx}'...`)
		Reflect.defineMetadata(PREFIX, pfx, target)
		Reflect.defineMetadata(ROUTE_OPTIONS, opts, target)
		console.info(`'${pfx}' controller has been defined`)
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
	return (target: ControllerClass, handler: symbol | string, _desc: TypedPropertyDescriptor<RouteHandler<M>>) => {
		console.info(`Defining endpoint ${method.toUpperCase()} ${path}...`)
		/*
		MAYBE: Verification

		Verifiy that this has to be target.constructor and there is no way to have it as target only
		*/
		const ctor = target.constructor
		const routes: RouteConfig[] = Reflect.getMetadata(ROUTES, ctor) ?? []
		routes.push({ method, path, handler })
		Reflect.defineMetadata(ROUTES, routes, ctor)
	}
}

/**
 *	Register all the provided controllers with the express api backend
 * @param controllers The list of controllers to register for the application
 * @returns The list of router objects with their prefixes created from the provided controllers
 *
 * @see {@link ControllerClass}
 */
export function RegisterControllers(...controllers: ControllerClass[]) {
	console.info(`Registering ${controllers.length} controller(s)...`)

	return controllers.map((controller) => {
		const c = new controller()
		const pfx: string = Reflect.getMetadata(PREFIX, controller)
		const opts: RouterOptions = Reflect.getMetadata(ROUTE_OPTIONS, controller)
		const rts: RouteConfig[] = Reflect.getMetadata(ROUTES, controller) ?? []
		const rtr = express.Router(opts)

		console.info(`Registering '${pfx}' with ${rts.length} endpoints...`)
		console.debug(rts)

		rts?.forEach(({ method, path, handler }) => {
			console.info(`Mounting endpoint ${method.toUpperCase()} '${path}' for '${pfx}'...`)
			switch (method) {
				case 'param':
					rtr[method](path, c[handler].bind(c) as RequestParamHandler)
					break
				default:
					rtr[method](path, c[handler].bind(c) as RequestHandler)
			}
		})

		return { path: pfx, router: rtr }
	})
}
