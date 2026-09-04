import { RenderError } from '@src/errors'
import { render } from '@testing-library/react-native'
import { PropsWithChildren } from 'react'
import { Text, View } from 'react-native'

export type TestApp = Awaited<ReturnType<typeof render>> | undefined
export class TestError extends Error {
	constructor(message?: string, cause?: Error) {
		super(message, {
			cause,
		})
	}
}

// type TestComponentProps = PropsWithChildren
// export function TestComponent({ children }: TestComponentProps) {
// 	return (
// 		<>
// 			<Text id='text'>Hello, World!</Text>
// 			{children}
// 		</>
// 	)
// }

export function handleRenderError(err: any) {
	console.error(err?.message)
	throw new RenderError(`Failed to render component`, {
		cause: err,
	})
}

export * from '@base/helpers' //place at the end of file
