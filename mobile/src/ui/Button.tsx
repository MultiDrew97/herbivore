import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { useTheme } from 'expo-router'
import { Button, ButtonProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

type HerbButtonProps = ButtonProps & { style?: StyleProp<ViewStyle> }
export default function HerbButton({ onPress, style, color, ...rest }: HerbButtonProps) {
	const { colors } = useTheme()
	return (
		<View style={[styles.container, style]}>
			<Button
				onPress={async (event) => {
					await impactAsync(ImpactFeedbackStyle.Soft)

					onPress?.(event)
				}}
				color={color ?? colors.primary}
				{...rest}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
})
