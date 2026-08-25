import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { Button, ButtonProps } from 'react-native'

type HerbButtonProps = ButtonProps
export default function HerbButton({ onPress, ...rest }: HerbButtonProps) {
	return (
		<Button
			onPress={async (event) => {
				await impactAsync(ImpactFeedbackStyle.Soft)

				onPress?.(event)
			}}
			{...rest}
		/>
	)
}
