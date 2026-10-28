import { herbRender } from '@spec/helpers'
import { act, userEvent } from '@testing-library/react-native'
import SelectionList from '@src/ui/SelectionList'
import { vi } from 'vitest'

const testItems = [
	{ _id: '1', name: 'Jane Roe' },
	{ _id: '2', name: 'John Doe' },
	{ _id: '3', name: 'Naname Sambade' },
]
type ListItem = (typeof testItems)[0]
type SelectionListProps = Parameters<typeof SelectionList<ListItem>>[0]
// const renderSpy = vi.fn<SelectionListProps['renderItem']>((item) => (
// 	<Text
// 		key={item.index}
// 		testID={`item-${item.index}`}>
// 		{item.index} - {item.value.name}
// 	</Text>
// ))

const selectionSpy = vi.fn<SelectionListProps['onSelectionChanged']>((selection) => {
	console.debug(`${selection.length} items selected`)
})

const props: SelectionListProps = {
	items: testItems.map((i, idx) => ({ selected: false, index: idx, label: i.name, value: i })),
	// renderItem: renderSpy,
	onSelectionChanged: selectionSpy,
}
const list = <SelectionList {...props} />
describe('<SelectionList />', () => {
	test('Renders', async () => {
		await expect(herbRender(list)).resolves.toBeDefined()
	})

	test('Renders Items', async () => {
		const app = await herbRender(list)

		// expect(renderSpy).toHaveBeenCalledTimes(testItems.length)

		expect(app.queryAllByTestId(/item-\d+/i)).toHaveLength(testItems.length)
	})

	test('Selection', async () => {
		const app = await herbRender(list)

		const item1Id = testItems[Math.floor(Math.random() * (testItems.length - 1))]._id
		const removeItem = ({ _id }: ListItem) => _id != item1Id
		const item2Id =
			testItems.filter(removeItem)[Math.floor(Math.random() * (testItems.filter(removeItem).length - 1))]._id
		let item1 = await app.findByTestId(`list-item-${item1Id}`)
		let item2 = await app.findByTestId(`list-item-${item2Id}`)
		const icon1 = await app.findByTestId(`list-icon-${item1Id}`)
		const icon2 = await app.findByTestId(`list-icon-${item2Id}`)

		await act(async () => {
			await userEvent.press(item1)
			await userEvent.press(item2)
		})

		expect(selectionSpy).toHaveBeenCalledTimes(2)
		expect(selectionSpy.mock.lastCall?.[0]).toHaveLength(1)
		expect(selectionSpy.mock.lastCall?.[0].map((i) => i.index)).not.toContain(+item1Id)
		expect(selectionSpy.mock.lastCall?.[0].map((i) => i.index)).toContain(+item2Id)

		expect(icon1).toHaveProperty('name', 'checkmark.bubble')
		expect(icon2).toHaveProperty('name', 'checkmark.circle')

		props.multiple = true
		app.rerender(<SelectionList {...props} />)

		await act(async () => {
			await userEvent.press(item1)
			await userEvent.press(item2)
		})
		expect(selectionSpy).toHaveBeenCalledTimes(2)
		expect(selectionSpy.mock.lastCall?.[0]).toHaveLength(2)
		expect(selectionSpy.mock.lastCall?.[0]).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining({ index: +item1Id, selected: true }),
				expect.objectContaining({ index: +item2Id, selected: true }),
			])
		)

		expect(icon1).toHaveProperty('name', 'checkmark.circle')
		expect(icon2).toHaveProperty('name', 'checkmark.circle')
	})
})
