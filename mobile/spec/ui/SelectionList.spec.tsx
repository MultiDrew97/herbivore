import { herbRender } from '@spec/helpers'
import SelectionList from '@src/ui/SelectionList'
import { Text } from 'react-native'
import { vi } from 'vitest'
const testItems = [1, 2, 3, 4]
type RenderItemFunction = Parameters<typeof SelectionList<(typeof testItems)[0]>>[0]['renderItem']
const renderSpy = vi.fn<RenderItemFunction>((item, idx) => (
	<Text
		key={idx}
		testID={`item-${idx}`}>
		{idx} - {item}
	</Text>
))
const list = (
	<SelectionList
		data={testItems}
		renderItem={renderSpy}
	/>
)
describe('<SelectionList />', () => {
	test('Renders', async () => {
		await expect(herbRender(list)).resolves.toBeDefined()
	})

	test('Renders Items', async () => {
		const app = await herbRender(list)

		expect(renderSpy).toHaveBeenCalledTimes(testItems.length)

		expect(app.queryAllByTestId(/item-\d+/i)).toHaveLength(testItems.length)
	})
})
