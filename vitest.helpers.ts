/** An empty function with no output */
export const noop = vi.defineHelper(() => {})
export const random = vi.defineHelper((min: number, max: number) => Math.random() * (max - min + 1))

type LogTypes = 'log' | 'debug' | 'error' | 'warn' | 'info'
export const silenceLogs = vi.defineHelper((...types: LogTypes[]) => {
	/*
	FIXME: Scalablility

	Resolve so that this ensures that each one only occurs once
	*/
	types.forEach((t) => {
		vi.spyOn(console, t).mockImplementation(noop.bind(console))
	})
})

type WaitOptions = {
	timeout: number
	interval: number
}

/** Custom wait for function for when the vitest global version isn't available. Usually from the global setup files */
export const waitFor = vi.defineHelper(async (fn: () => Promise<void> | void, opts?: Partial<WaitOptions>) => {
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
})
