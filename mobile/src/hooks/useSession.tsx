import { createContext, PropsWithChildren, useCallback, useContext } from 'react'
import { useStorage } from './useStorage'

/*
FIXME: Modularity

I need to determine how to make this session handler modular so that I can use it in any other projects I may start

I want this package to be able to speed up some dev implementations so that I can use it in any format I wish and not be making so much boiler plate within the child apps
*/
type PCSessionManager<T = unknown> = {
	login: (user: T) => void
	logout: () => void
}
type PCSession<T, B = unknown> = PCSessionManager<T> & {
	userID: string
} & B

const SessionManagerContext = createContext<PCSessionManager>({
	login: () => null,
	logout: () => null,
})

export default function useSession<T>(): PCSession<T> {
	const mgr = useContext(SessionManagerContext)
  const storage = useStorage()

	if (!mgr) {
		throw new Error('useSession must be used within a SessionProvider')
	}

	return { ...mgr, userID: storage.getUserID() }
}

type SessionProviderProps<T> = PropsWithChildren<{
	onLogin?: (usr: T) => void
	onLogout?: () => void
}>
export function SessionProvider<T>({ children, onLogin, onLogout }: SessionProviderProps<T>) {
	// const [session, setSession] = useState<UserMeta>({
	//   userID: storage.getString(STORAGE_KEYS.STORAGE_USER_ID),
	//   config: JSON.parse(
	//     storage.getString(STORAGE_KEYS.STORAGE_USER_CONFIG) ?? 'null',
	//   ),
	// });

	const login = useCallback(async (user: T) => {
		try {
			onLogin && onLogin(user)
		} catch (err) {
			console.error('Failed to login: ', err.message)
			throw err
		}
	}, [])

	const logout = useCallback(() => {
		onLogout && onLogout()
	}, [])

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
