import { ProviderError } from '@src/errors'
import Constants from 'expo-constants'
import { createContext, PropsWithChildren, useContext } from 'react'
import { Configuration, MMKV, useMMKV } from 'react-native-mmkv'

export enum StorageKeys {
	UserID = 'userID',
	Config = 'config',
}

const StorageContext = createContext<Configuration | null>(null)

export function useStorage(cfg?: Partial<Configuration>): MMKV {
	const baseCfg = useContext(StorageContext)

	if (!baseCfg) throw new ProviderError('useStorage must be used from within a StorageProvider')

	const storage = useMMKV(baseCfg)

	return storage
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
	return <StorageContext.Provider value={{ id, encryptionKey }}>{children}</StorageContext.Provider>
}
