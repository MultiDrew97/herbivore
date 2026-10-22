import { render, RenderOptions } from '@testing-library/react-native'
import { ReactElement } from 'react'
import { vi } from 'vitest'

export const herbRender = vi.defineHelper(
	(elmt: ReactElement, wrapper?: RenderOptions['wrapper'], opts?: Omit<RenderOptions, 'wrapper'>) =>
		render(elmt, {
			...opts,
			wrapper,
		}).catch(handleRenderError)
)

export type TestApp = Awaited<ReturnType<typeof render>> | undefined
export class TestError extends Error {
	constructor(message?: string, cause?: Error) {
		super(message, {
			cause,
		})
	}
}

export class RenderError extends TestError {}

export const handleRenderError = vi.defineHelper((err: any) => {
	console.error(err?.message)
	throw new RenderError(`Failed to render component`, err)
})

export * from '@base/helpers' //place at the end of file
