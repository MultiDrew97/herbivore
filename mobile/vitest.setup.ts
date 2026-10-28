// import { silenceLogs } from '@spec/helpers'
// silenceLogs('debug', 'warn', 'info', 'log')

import { DefaultTheme } from 'expo-router'
import { createElement } from 'react'
import { vi } from 'vitest'

vi.mock('expo-symbols', () => ({
	SymbolView: (props: import('expo-symbols').SymbolViewProps) => createElement('View', props),
}))

// vi.mock('expo-haptics', () => ({
// 	ImpactFeedbackStyle: {
// 		Soft: 'soft',
// 		Rigid: 'rigid',
// 		Light: 'light',
// 		Medium: 'medium',
// 		Hard: 'hard',
// 	} as const,
// 	impactAsync: vi.fn(async (style: ImpactFeedbackStyle) => console.info(`${style} style impact...`)),
// }))

vi.mock('expo-router', () => ({
	useTheme: () => DefaultTheme,
	DefaultTheme: {
		colors: {
			primary: 'blue',
		},
	},
}))
