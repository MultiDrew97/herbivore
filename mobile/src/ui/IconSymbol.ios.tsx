import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols'
import { IconSymbolProps } from './IconSymbol'
import { StyleProp, ViewStyle } from 'react-native'

export type IconSymbolIosProps = IconSymbolProps<{
	name: SymbolViewProps['name']
	style?: StyleProp<ViewStyle>
	weight?: SymbolViewProps['weight']
}>
export default function IconSymbol({ name, color, style, size = 16, weight = 'regular', ...rest }: IconSymbolIosProps) {
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
