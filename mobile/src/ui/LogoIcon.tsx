import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { IconSymbol } from './IconSymbol'
import { useTheme } from '@react-navigation/core'
import { PropsWithoutRef } from 'react'

type LogoIconProps = PropsWithoutRef<{
	size?: number
	style?: StyleProp<ViewStyle>
}>
export default function LogoIcon({ size = 64, style }: LogoIconProps) {
	const { colors } = useTheme()

	return (
		<View style={[styles.container, style]}>
			<IconSymbol
				size={size}
				color={colors.primary}
				name="creditcard.circle"
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
})
