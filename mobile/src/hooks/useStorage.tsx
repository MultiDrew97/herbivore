import Constants from 'expo-constants'
import { createContext, PropsWithChildren, useContext } from 'react'
import { MMKV, useMMKV } from 'react-native-mmkv'



type StorageContext = {
	getUserID: () => string
	setUserID: (userID: string) => void
	getConfig: () => any
	setConfig: (cfg: any) => void
}
const StorageContext = createContext<StorageContext>(null)

export function useStorage(): StorageContext {
	const value = useContext(StorageContext)

	if (!value) {
		throw new Error('useStorage must be used within a StorageProvider')
	}

	return value
}

type StorageProviderProps = PropsWithChildren<{
	id?: string
	encryptionKey?: string
}>
export function StorageProvider({
	children,
	encryptionKey,
	id = `${Constants.expoConfig.name}-mmkv-default`,
}: StorageProviderProps) {
	/*
	 * FIXME: Encryption
	 * 		[ ]	Determine best way to generate and store encryptionKey
	 */
	const storage = useMMKV({
		id,
		encryptionKey,
	})

	return (
		<StorageContext.Provider
			value={{
				getUserID: () => storage.getString('userID'),
				setUserID: (userID: string) => storage.set('userID', userID),
				getConfig: () => JSON.parse(storage.getString('config') ?? 'null'),
				setConfig: (cfg: any) => storage.set('config', JSON.stringify(cfg)),
			}}>
			{children}
		</StorageContext.Provider>
	)
}
