import { SymbolView, SymbolViewProps } from 'expo-symbols'
import { PropsWithoutRef } from 'react'
import { ColorValue } from 'react-native'

export type IconSymbolProps = PropsWithoutRef<
	{
		color: ColorValue
	} & Pick<SymbolViewProps, 'name' | 'weight' | 'size' | 'testID' | 'style'>
>
export default function IconSymbol({ name, color, style, size = 16, weight = 'regular', ...rest }: IconSymbolProps) {
	return (
		<SymbolView
			weight={weight}
			tintColor={color}
			name={name}
			style={[{ width: size, height: size }, style]}
			{...rest}
		/>
	)
}
