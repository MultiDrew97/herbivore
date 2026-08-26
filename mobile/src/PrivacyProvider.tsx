import { createContext, PropsWithChildren, useCallback, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const PrivacyContext = createContext<boolean>(false)

type PrivacyProviderProps = PropsWithChildren<{
	onShowPrivacy?: (state: AppStateStatus) => void | Promise<void>
	onHidePrivacy?: (state: AppStateStatus) => void | Promise<void>
}>
export default function PrivacyProvider({ children, onShowPrivacy, onHidePrivacy }: PrivacyProviderProps) {
	const stateHandler = useCallback((status: AppStateStatus) => {
		console.debug('Current State - ', status)

		switch (status) {
			case 'active':
				onHidePrivacy?.(status)
				break
			default:
				onShowPrivacy?.(status)
		}
	}, [])
	useEffect(() => {
		const listeners = [AppState.addEventListener('change', stateHandler)]

		return () => {
			listeners.forEach((l) => l.remove())
		}
	}, [stateHandler])

	return children
}
