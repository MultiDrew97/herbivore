import React from 'react'
import { vi } from 'vitest'
import { silenceLogs } from './vitest.helpers'

vi.mock('expo-symbols', () => ({
	SymbolView: (props: Record<string, unknown>) => React.createElement('View', props),
}))

silenceLogs('debug', 'warn', 'info', 'log')
