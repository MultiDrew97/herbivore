import { createContext, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { useStorage } from './useStorage'
import { ProviderError } from '@src/errors'

type Config<T = unknown> = { config: T | null; saveConfig: (newConfig: SetStateAction<T>) => void }
const ConfigContext = createContext<Config | null>(null)

export function useConfig() {
	const ctx = useContext(ConfigContext)

	if (!ctx) throw new ProviderError('useConfig must be used from within a ConfigProvider')

	return [ctx.config, ctx.saveConfig] as const
	// const { userID } = useSession()
	// const { storage } = useStorage()
	// const [config, setConfig] = useState<T>()
	// const [config, setConfig] = useState<IUserConfig>(() =>
	//   JSON.parse(storage.getString(STORAGE_KEYS.STORAGE_USER_CONFIG) ?? 'null'),
	// );

	/**
	 * Apply the config settings to the app, such as theme preferences, notification settings, etc.
	 * This should be called whenever the config is updated to ensure that the user's preferences are
	 * reflected in the app immediately.
	 */
	// const applyConfig = useCallback(() => {
	// 	try {
	// 		if (!config) {
	// 			console.warn('No config present')
	// 			return
	// 		}

	// 		console.info('Applying config...')
	// 		/*
	//   This so far is the best way that I know to perform this check. I have my config values set to
	//   use the same values for light and dark, but didn't have one for system. So, if it's not system,
	//   use the value from the config itself, otherwise, set to null, assuming it's to be the system
	// theme.

	// MAYBE: Concerns

	// * Will this need to be updated if different app themes are provided?
	// - May not even be an issue, since app themes are a work in progress and may not make to prod
	// */
	// 		console.debug(`Updating color scheme to '${config.theme}' mode...`)
	// 		Appearance.setColorScheme(config.theme != 'system' ? config.theme : null)

	// 		console.info('Config has been applied')
	// 	} catch (err) {
	// 		console.error(err.message)
	// 	}
	// }, [storage])

	/**
	 * Save the config for the user then return the updated config to the caller.
	 * This will also apply the changes immediately to the app so that the user's
	 * preferences are seeen.
	 * @param newConfig The config to update with
	 * @returns The updated config
	 */
	// const saveConfig = useCallback(
	// 	async (newConfig: T) => {
	// 		try {
	// 			console.debug('Updating config: ', newConfig)
	// 			const updated = await updateConfig(userID, newConfig)
	// 			console.debug('Config after update: ', updated)
	// 			storage.set(STORAGE_KEYS.STORAGE_USER_CONFIG, JSON.stringify(updated))

	// 			// setConfig(updated);
	// 			applyConfig()
	// 		} catch (err) {
	// 			console.error(err.message)
	// 		}
	// 	},
	// 	[storage, userID, applyConfig],
	// )

	// if (!config) {
	//   throw new Error('useConfig must be used within a ConfigProvider');
	// }

	// return [
	// 	config,
	// 	(cfg: T) => {
	// 		console.info('Updating saved config...')
	// 		setConfig(cfg)
	// 	},
	// ]
}

type ConfigProviderProps<T> = PropsWithChildren<{ onUpdate?: (cfg: Config['config']) => void }>
export function ConfigProvider<T>({ children, onUpdate }: ConfigProviderProps<T>) {
	// const [config, setConfig] = useState<T>()
	const storage = useStorage()

	return (
		<ConfigContext.Provider
			value={{
				config: storage.getConfig(),
				saveConfig: (cfg: Config['config']) => {
					storage.setConfig(cfg)
					onUpdate && onUpdate(cfg)
				},
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
