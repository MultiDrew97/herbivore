// import { silenceLogs } from '@spec/helpers'
// silenceLogs('debug', 'warn', 'info', 'log')

import { createElement } from 'react'
import { vi } from 'vitest'
import { type Theme } from 'expo-router'

vi.mock('expo-symbols', () => ({
	SymbolView: (props: import('expo-symbols').SymbolViewProps) => createElement('View', props),
}))

vi.mock('expo-haptics', () => ({
	ImpactFeedbackStyle: {
		Soft: 'soft',
		Rigid: 'rigid',
		Light: 'light',
		Medium: 'medium',
		Hard: 'hard',
	} as const,
	impactAsync: vi.fn(async () => undefined),
}))

vi.mock('react-native-mmkv', async () => {
	const { useCallback, useSyncExternalStore } = await import('react')

	class MockMMKV {
		private values = new Map<string, string | number | boolean | ArrayBuffer>()
		private listeners = new Set<(key: string) => void>()

		set(key: string, value: string | number | boolean | ArrayBuffer) {
			this.values.set(key, value)
			this.notify(key)
		}

		getString(key: string) {
			const value = this.values.get(key)
			return typeof value === 'string' ? value : undefined
		}

		getNumber(key: string) {
			const value = this.values.get(key)
			return typeof value === 'number' ? value : undefined
		}

		getBoolean(key: string) {
			const value = this.values.get(key)
			return typeof value === 'boolean' ? value : undefined
		}

		getBuffer(key: string) {
			const value = this.values.get(key)
			return value instanceof ArrayBuffer ? value : undefined
		}

		getAllKeys() {
			return [...this.values.keys()]
		}

		remove(key: string) {
			const removed = this.values.delete(key)
			if (removed) this.notify(key)
			return removed
		}

		addOnValueChangedListener(listener: (key: string) => void) {
			this.listeners.add(listener)
			return { remove: () => this.listeners.delete(listener) }
		}

		private notify(key: string) {
			this.listeners.forEach((listener) => listener(key))
		}
	}

	const instances = new Map<string, MockMMKV>()
	const getInstance = (configuration?: { id?: string }) => {
		const id = configuration?.id ?? 'mmkv.default'
		let instance = instances.get(id)
		if (!instance) {
			instance = new MockMMKV()
			instances.set(id, instance)
		}
		return instance
	}

	return {
		useMMKV: getInstance,
		useMMKVString(key: string, instance?: MockMMKV) {
			const storage = instance ?? getInstance()
			const subscribe = useCallback(
				(onChange: () => void) => {
					const listener = storage.addOnValueChangedListener((changedKey) => {
						if (changedKey === key) onChange()
					})
					return () => listener.remove()
				},
				[key, storage]
			)
			const getSnapshot = useCallback(() => storage.getString(key), [key, storage])
			const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
			const setValue = useCallback(
				(nextValue: string | undefined) => {
					if (nextValue === undefined) storage.remove(key)
					else storage.set(key, nextValue)
				},
				[key, storage]
			)
			return [value, setValue] as const
		},
	}
})

vi.mock('expo-router', async () => {
	const DefaultTheme: Theme = {
		dark: false,
		colors: {
			primary: 'blue',
			background: 'white',
			card: null,
			text: null,
			border: null,
			notification: 'red',
		},
		fonts: {
			regular: {
				fontFamily: '',
				fontWeight: 'bold',
			},
			medium: {
				fontFamily: '',
				fontWeight: 'bold',
			},
			bold: {
				fontFamily: '',
				fontWeight: 'bold',
			},
			heavy: {
				fontFamily: '',
				fontWeight: 'bold',
			},
		},
	}
	const DarkTheme: Theme = {
		dark: true,
		colors: {
			primary: 'blue',
			background: 'black',
			card: null,
			text: null,
			border: null,
			notification: 'red',
		},
		fonts: {
			regular: {
				fontFamily: '',
				fontWeight: 'bold',
			},
			medium: {
				fontFamily: '',
				fontWeight: 'bold',
			},
			bold: {
				fontFamily: '',
				fontWeight: 'bold',
			},
			heavy: {
				fontFamily: '',
				fontWeight: 'bold',
			},
		},
	}

	return {
		useTheme: () => DefaultTheme, // DarkTheme),
		DefaultTheme,
		DarkTheme,
	} as Partial<typeof import('expo-router')>
})
