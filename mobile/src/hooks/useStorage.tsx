import { ProviderError } from '@src/errors'
import Constants from 'expo-constants'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { Configuration, useMMKV } from 'react-native-mmkv'

interface Storage {
	getUserID: () => string | undefined
	setUserID: (userID: string) => void
	getConfig: () => any
	setConfig: (cfg: any) => void
}
const Storage = createContext<Configuration | null>(null)

export function useStorage(): Storage {
	const ctx = useContext(Storage)

	if (!ctx) throw new ProviderError('useStorage must be used from within a StorageProvider')

	console.debug('useStorage: ', ctx)
	const storage = useMMKV(ctx)

	return {
		getUserID: () => storage.getString('userID'),
		setUserID: (userID: string) => storage.set('userID', userID),
		getConfig: () => JSON.parse(storage.getString('config') ?? 'null'),
		setConfig: (cfg: any) => storage.set('config', JSON.stringify(cfg)),
	} as const
}

type StorageProviderProps = PropsWithChildren<{ id?: string; encryptionKey?: string }>
export function StorageProvider({
	children,
	encryptionKey,
	id = `${Constants.expoConfig?.name ?? 'App'}-mmkv-default`,
}: StorageProviderProps) {
	/*
	 * FIXME: Encryption
	 * 		[ ]	Determine best way to generate and store encryptionKey
	 */
	// const storage = useMMKV({ id, encryptionKey })
	const [conf] = useState<Configuration>({ id, encryptionKey })
	return (
		<Storage.Provider value={conf}>
			{/* value={{
				getUserID: () => '', //storage.getString('userID'),
				setUserID: (userID: string) => null, //storage.set('userID', userID),
				getConfig: () => {}, //JSON.parse(storage.getString('config') ?? 'null'),
				setConfig: (cfg: any) => null, // storage.set('config', JSON.stringify(cfg)),
			}}> */}
			{children}
		</Storage.Provider>
	)
}
