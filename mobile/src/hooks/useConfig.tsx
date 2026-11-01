import { ProviderError } from '@src/errors'
import { createContext, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { StorageKeys, useStorage } from './useStorage'

/* FIXME: Constraint this generification better */
type Config<T = any> = {
	config: T | null
	saveConfig: (newConfig: SetStateAction<T>) => void
}
const ConfigContext = createContext<Config | null>(null)

export function useConfig() {
	const ctx = useContext(ConfigContext)

	if (!ctx) throw new ProviderError('useConfig must be used from within a ConfigProvider')

	return {
		current: ctx.config,
		update: ctx.saveConfig,
	}
}

type ConfigProviderProps<T> = PropsWithChildren<{
	onUpdate?: (cfg: T) => void
}>
export function ConfigProvider<T>({ children, onUpdate }: ConfigProviderProps<T>) {
	const [cfg, setConfig] = useState<T | null>(null)
	const storage = useStorage()

	useEffect(() => {
		const listeners = [
			storage.addOnValueChangedListener((key) => {
				if (key != StorageKeys.Config) return

				console.info('Updating config in from storage')
				setConfig(JSON.parse(storage.getString(StorageKeys.Config) ?? 'null'))
			}),
		]

		return () => listeners.forEach((l) => l.remove())
	}, [storage])

	const saveConfig = useCallback(
		(newCfg: T) => {
			storage.set(StorageKeys.Config, JSON.stringify(newCfg))
			setConfig(newCfg)
			onUpdate?.(newCfg)
		},
		[storage, onUpdate]
	)

	return (
		<ConfigContext.Provider
			value={{
				config: cfg,
				saveConfig,
			}}>
			{children}
		</ConfigContext.Provider>
	)
}

// MAYBE: Convert to use the useCallback function and export that instead?
// function ApplyConfig() {
//   try {
//     const config = useConfig();
//     if (!config) {
//       console.warn('No config present');
//       return;
//     }

//     console.info('Applying config...');
//     /*
//     This so far is the best way that I know to perform this check. I have my config values set to
//     use the same values for light and dark, but didn't have one for system. So, if it's not system,
//     use the value from the config itself, otherwise, set to null, assuming it's to be the system
//   theme.

//   MAYBE: Concerns

//   * Will this need to be updated if different app themes are provided?
//   - May not even be an issue, since app themes are a work in progress and may not make to prod
//   */
//     console.debug(`Updating color scheme to '${config.theme}' mode...`);
//     Appearance.setColorScheme(config.theme != 'system' ? config.theme : null);

//     console.info('Config has been applied');
//   } catch (err) {
//     console.error(err.message);
//   }
// }

/**
 * Save the config for the user then return the updated config to the caller.
 * This will also apply the changes immediately to the app so that the user's
 * preferences are seeen.
 * @param newConfig The config to update with
 * @returns The updated config
 *
 * @see {@link IUserConfig}
 */
// export async function saveConfig(newConfig: IUserConfig) {
//   try {
//     const userID = getUserID();
//     console.debug('Updating config: ', newConfig);
//     const config = await updateConfig(userID, newConfig);
//     console.debug('Config after update: ', config);
//     storage.set(STORAGE_KEYS.STORAGE_USER_CONFIG, JSON.stringify(config));
//     ApplyConfig();

//     return config;
//   } catch (err) {
//     console.error(err.message);
//   }
// }

/*
FIXME: Optimization

Update this so that the updateConfig method can just be used here and everytime I use this hook,
I pass the value and an update function (similar to the useState hook), so that the config can
be used and updated when necessary and apply across the app seemlessly
*/
// export function useConfig(): IUserConfig {
//   const configStr = storage.getString(STORAGE_KEYS.STORAGE_USER_CONFIG);

//   if (!configStr || !/^{.+}$/.test(configStr)) return {} as IUserConfig;

//   return JSON.parse(configStr);
//   // return [JSON.parse(configStr) as IUserConfig, saveConfig];
// }
