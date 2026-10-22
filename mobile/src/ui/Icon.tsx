import { useTheme } from 'expo-router'
import { SymbolView, SymbolViewProps } from 'expo-symbols'
import { PropsWithoutRef } from 'react'
import { ColorValue } from 'react-native'

export type IconProps = Pick<SymbolViewProps, 'name' | 'weight' | 'size' | 'testID' | 'style'> &
	PropsWithoutRef<{
		color?: ColorValue
	}>
export default function Icon({ color, style, size = 16, weight = 'regular', ...rest }: IconProps) {
	const { colors } = useTheme()
	return (
		<SymbolView
			weight={weight}
			tintColor={color ?? colors.primary}
			style={[{ width: size, height: size }, style]}
			{...rest}
		/>
	)
}
