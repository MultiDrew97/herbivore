import { SymbolView } from 'expo-symbols'
import { IconSymbolProps } from './IconSymbol'

// type IconSymbolProps = {
// 	name: SymbolViewProps['name']
// 	color: string
// 	size?: number
// 	style?: StyleProp<ViewStyle>
// 	weight?: SymbolWeight
// }
export function IconSymbol({ name, color, style, size = 24, weight = 'regular' }: IconSymbolProps) {
	return (
		<SymbolView
			weight={weight}
			tintColor={color}
			name={name}
			style={[
				{
					width: size,
					height: size,
				},
				style,
			]}
		/>
	)
}
