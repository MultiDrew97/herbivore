import { herbRender, noop } from '@spec/helpers'
import IconButton from '@src/ui/IconButton'
import { screen, userEvent } from '@testing-library/react-native'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { DefaultTheme } from 'expo-router'
import { vi } from 'vitest'

type IconButtonProps = Parameters<typeof IconButton>[0]
const press = vi.fn<Exclude<IconButtonProps['onPress'], undefined>>(noop)
const longPress = vi.fn<Exclude<IconButtonProps['onLongPress'], undefined>>(noop)

const buttonRegex = /button$/i
const iconRegex = /.*-?icon/i
const props = {
	testID: 'button',
	name: 'checkmark',
	size: 16,
	onPress: press,
	onLongPress: longPress,
} as IconButtonProps

describe('<IconButton />', () => {
	test('Render', async () => {
		const app = await herbRender(<IconButton {...props} />)

		expect(app).toBeDefined()

		let button = screen.getByTestId(buttonRegex)
		let icon = await screen.findByTestId(iconRegex)
		expect(button).toBeDefined()
		expect(button).toBeOnTheScreen()
		expect(button).toBeEnabled()
		expect(button).toBeVisible()

		expect(icon).toBeDefined()
		expect(icon).toBeOnTheScreen()
		expect(icon).toBeVisible()
		expect(icon).toHaveProp('name', props.name)
		expect(icon).toHaveStyle({ width: props.size, height: props.size })
		expect(icon).toHaveProp('tintColor', DefaultTheme.colors.primary)

		props.size = 256
		props.name = 'xmark'
		props.color = 'red'
		await app.rerender(
			<IconButton
				{...props}
				disabled={true}
			/>
		)

		button = screen.getByTestId(props.testID!)
		icon = await screen.findByTestId(iconRegex)

		expect(button).not.toBeEnabled()

		expect(icon).toBeDefined()
		expect(icon).toBeOnTheScreen()
		expect(icon).toBeVisible()
		expect(icon).toHaveProp('name', props.name)
		expect(icon).toHaveProp('tintColor', props.color)
		expect(icon).toHaveStyle({ width: props.size, height: props.size })
		expect(icon).not.toHaveProp('tintColor', DefaultTheme.colors.primary)
	})

	test('Pressable', async () => {
		const app = await herbRender(<IconButton {...props} />)

		expect(app).toBeDefined()

		const button = await screen.findByTestId('button')

		expect(button).toBeOnTheScreen()
		expect(button).toBeEnabled()

		await userEvent.press(button)
		await userEvent.longPress(button)

		expect(impactAsync).toHaveBeenNthCalledWith(1, ImpactFeedbackStyle.Soft)
		expect(press).toHaveBeenCalled()

		expect(impactAsync).toHaveBeenNthCalledWith(2, ImpactFeedbackStyle.Medium)
		expect(longPress).toHaveBeenCalled()
	})
})
