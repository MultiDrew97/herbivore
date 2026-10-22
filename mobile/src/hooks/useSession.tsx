import { ProviderError } from '@src/errors'
import { StorageKeys, useStorage } from '@src/hooks/useStorage'
import { createContext, PropsWithChildren, useCallback, useContext } from 'react'
import { useMMKVString } from 'react-native-mmkv'

/*
FIXME: Modularity

I need to determine how to make this session handler modular so that I can use it in any other projects I may start

I want this package to be able to speed up some dev implementations so that I can use it in any format I wish and not be making so much boiler plate within the child apps
*/
export type HerbUser = { _id: string; config?: HerbConfig }
type HerbConfig = Record<string, any> & {
	theme?: 'light' | 'dark' | 'system' | 'auto'
}
type SessionManager<T extends HerbUser = any> = {
	login: (user: T) => Promise<void>
	logout: () => Promise<void>
}

type Session<T extends HerbUser, B extends Record<string, any> = Record<string, any>> = SessionManager<T> & {
	userID: HerbUser['_id'] | null
} & B

const SessionManagerContext = createContext<SessionManager | null>(null)

export function useSession<T extends HerbUser>(): Session<T> {
	const mgr = useContext(SessionManagerContext)

	if (!mgr) throw new ProviderError('useSession must be used within a SessionProvider')

	const storage = useStorage()
	const [userID] = useMMKVString(StorageKeys.UserID, storage)

	return { ...mgr, userID: userID ?? null }
}

type SessionProviderProps = PropsWithChildren<{
	onLogin?: (usr: HerbUser['_id']) => Promise<void>
	onLogout?: () => Promise<void>
}>
export function SessionProvider<T extends HerbUser>({ children, onLogin, onLogout }: SessionProviderProps) {
	const storage = useStorage()
	const [_, setID] = useMMKVString(StorageKeys.UserID, storage)

	const login = useCallback(
		async (user: T) => {
			try {
				console.info('Performing login procedure...')
				setID(user._id)
				await onLogin?.(user._id)
			} catch (err: any) {
				console.error('Failed to login: ', err.message)
				throw err
			}
		},
		[setID, onLogin]
	)

	const logout = useCallback(async () => {
		console.info('Performing logout procedure...')
		console.debug('Current Storage - ', storage.getAllKeys())

		storage.remove(StorageKeys.UserID)

		console.debug('After clear - ', storage.getAllKeys())
		await onLogout?.()
	}, [storage, onLogout])

	return (
		<SessionManagerContext.Provider
			value={{
				login,
				logout,
			}}>
			{children}
		</SessionManagerContext.Provider>
	)
}
