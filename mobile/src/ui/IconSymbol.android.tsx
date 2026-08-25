// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolViewProps } from 'expo-symbols'
import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { IconSymbolProps } from './IconSymbol'

// Add any SFSymbol to MaterialIcons mappings here.
const MAPPING = {
	// See MaterialIcons here: https://icons.expo.fyi
	// See SF Symbols in the SF Symbols app on Mac.
	'house.fill': 'home',
	'paperplane.fill': 'send',
	'chevron.left.forwardslash.chevron.right': 'code',
	'chevron.right': 'chevron-right',
} as Partial<Record<SymbolViewProps['name'], React.ComponentProps<typeof MaterialIcons>['name']>>

export type IconSymbolAndroidProps = IconSymbolProps<{ name: keyof typeof MAPPING; style?: StyleProp<TextStyle> }>

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export default function IconSymbolAndroid({ name, size = 16, color, style, ...rest }: IconSymbolAndroidProps) {
	return (
		<MaterialIcons
			color={color}
			size={size}
			name={MAPPING[name]}
			style={style}
			{...rest}
		/>
	)
}
