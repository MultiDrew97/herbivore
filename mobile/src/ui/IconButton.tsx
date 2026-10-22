import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import Icon, { IconProps } from './Icon'

export type IconButtonProps = Pick<TouchableOpacityProps, 'onPress' | 'onLongPress' | 'style' | 'testID' | 'disabled'> &
	Pick<IconProps, 'name' | 'size' | 'color'> & {
		iconStyle?: StyleProp<ViewStyle>
	}
export default function IconButton({
	testID,
	name,
	onPress,
	onLongPress,
	style,
	iconStyle,
	color,
	disabled,
	size,
}: IconButtonProps) {
	return (
		<>
			<TouchableOpacity
				testID={testID}
				disabled={disabled}
				style={[styles.container, { height: size, width: size }, style]}
				onPress={async (event) => {
					await impactAsync(ImpactFeedbackStyle.Soft)
					onPress?.(event)
				}}
				onLongPress={async (event) => {
					await impactAsync(ImpactFeedbackStyle.Medium)
					onLongPress?.(event)
				}}>
				<Icon
					style={iconStyle}
					testID='button-icon'
					name={name}
					size={size}
					color={color}
				/>
			</TouchableOpacity>
		</>
	)
}

const styles = StyleSheet.create({
	container: { alignContent: 'center', alignItems: 'center', justifyContent: 'center' },
})
