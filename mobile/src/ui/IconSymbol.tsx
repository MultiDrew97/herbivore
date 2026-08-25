import { OpaqueColorValue, Platform } from 'react-native'
import IconSymbolIos, { IconSymbolIosProps } from './IconSymbol.ios'
import IconSymbolAndroid, { IconSymbolAndroidProps } from './IconSymbol.android'
import { PropsWithoutRef } from 'react'

export type IconSymbolProps<T = unknown> = PropsWithoutRef<{ size?: number; color: string | OpaqueColorValue } & T>

export { IconSymbolIosProps, IconSymbolAndroidProps }
export type IconProps = IconSymbolIosProps | IconSymbolAndroidProps
export default function IconSymbol(props: IconProps) {
	return Platform.select({
		ios: IconSymbolIos(props as IconSymbolIosProps),
		android: IconSymbolAndroid(props as IconSymbolAndroidProps),
		default: null,
	})
}
