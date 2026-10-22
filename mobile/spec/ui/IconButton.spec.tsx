import { herbRender, noop } from '@spec/helpers'
import IconButton, { IconButtonProps } from '@src/ui/IconButton'
import { fireEvent, screen } from '@testing-library/react-native'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import { DefaultTheme } from 'expo-router'
import { vi } from 'vitest'

describe('<IconButton />', () => {
	test('Render', async () => {
		const buttonRegex = /button$/i
		const iconRegex = /.*-?icon/i
		const props = {
			testID: 'button',
			name: 'checkmark',
			size: 16,
		} as IconButtonProps
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
		props.disabled = true
		await app.rerender(<IconButton {...props} />)

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
		const press = vi.fn(noop)
		const longPress = vi.fn(noop)

		const app = await herbRender(
			<IconButton
				testID='button'
				name='checkmark'
				onPress={press}
				onLongPress={longPress}
			/>
		)

		expect(app).toBeDefined()

		const button = await screen.findByTestId('button')

		expect(button).toBeOnTheScreen()

		await fireEvent(button, 'press')
		expect(impactAsync).toHaveBeenLastCalledWith(ImpactFeedbackStyle.Soft)
		expect(press).toHaveBeenCalled()

		await fireEvent(button, 'longPress')
		expect(impactAsync).toHaveBeenLastCalledWith(ImpactFeedbackStyle.Medium)
		expect(longPress).toHaveBeenCalled()
	})
})
