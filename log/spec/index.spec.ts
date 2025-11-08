import Logger from '@src'

describe('Logger Tests', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('Logger Instantiation', () => {
		let logger = new Logger()
		const { value: defaultHeading } = Object.getOwnPropertyDescriptor(logger, 'heading')!
		const { value: defaultShowDate } = Object.getOwnPropertyDescriptor(logger, 'showDate')!

		expect(logger).toBeDefined()
		expect(defaultHeading).toBe('[APP]')
		expect(defaultShowDate).toBeTruthy()

		logger = new Logger('TEST', false)
		const { value: testHeading } = Object.getOwnPropertyDescriptor(logger, 'heading')!
		const { value: testShowDate } = Object.getOwnPropertyDescriptor(logger, 'showDate')!
		expect(logger).toBeDefined()
		expect(testHeading).toBe('[TEST]')
		expect(testShowDate).toBeFalsy()

		logger = new Logger('ONLY')
		const { value: onlyHeading } = Object.getOwnPropertyDescriptor(logger, 'heading')!
		const { value: onlyShowDate } = Object.getOwnPropertyDescriptor(logger, 'showDate')!
		expect(logger).toBeDefined()
		expect(onlyHeading).toBe('[ONLY]')
		expect(onlyShowDate).toBeTruthy()

		logger = new Logger(undefined, false)
		const { value: onlyDateHead } = Object.getOwnPropertyDescriptor(logger, 'heading')!
		const { value: onlyDateShowDate } = Object.getOwnPropertyDescriptor(logger, 'showDate')!
		expect(logger).toBeDefined()
		expect(onlyDateHead).toBe('[APP]')
		expect(onlyDateShowDate).toBeFalsy()
	})

	test('Logging Methods', () => {
		let logs = new Logger()
		const spies = []
		const proto = Object.getPrototypeOf(logs)
		const methods = Object.getOwnPropertyNames(proto).filter(
			(name) =>
				typeof proto[name] === 'function' && name != 'constructor' && name != 'getDate' && name != 'prepHeader'
		)

		console.debug(methods)

		for (let method of methods) {
			let idx =
				spies.push(
					jest.spyOn(logs, method as keyof Logger).mockImplementation((message?: any, ...data: any[]) => {
						console.info(`${method}: ${message}`, ...data)
					})
				) - 1

			logs[method as keyof Logger](`Testing ${method}...`)

			expect(spies[idx]).toHaveBeenCalledTimes(1)
		}
	})

	test('Logger Header Parsing', () => {
		let logs = new Logger('[[Test]]')
		const { value: h } = Object.getOwnPropertyDescriptor(logs, 'heading')!
		expect(h).toBe('[Test]')

		logs = new Logger('456dasd46sa')
		const { value: h2 } = Object.getOwnPropertyDescriptor(logs, 'heading')!
		expect(h2).toBe('[456dasd46sa]')

		logs = new Logger('({[Test!@#*(^$&^#(&^$!^^&*)$^*$!123\'"/*-+>?<>?<>?<>?\\//||)]})')
		const { value: h3 } = Object.getOwnPropertyDescriptor(logs, 'heading')!
		expect(h3).toBe('[Test123]')

		// TODO: Allow for other special charaters (i.e. [Test:API] [Test > CORE] etc.)
	})
})
