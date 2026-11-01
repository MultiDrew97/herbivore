import { herbRender } from '@spec/helpers'
import SelectionList from '@src/ui/SelectionList'
import { userEvent } from '@testing-library/react-native'
import { type SFSymbol } from 'expo-symbols'
import { vi } from 'vitest'

const checkedName: SFSymbol = 'checkmark'
const uncheckedName: SFSymbol = 'square'

const testItems = [
	{ _id: '1', name: 'Jane Roe' },
	{ _id: '2', name: 'John Doe' },
	{ _id: '3', name: 'Naname Sambade' },
]
type ListItem = (typeof testItems)[0]
type SelectionListProps = Parameters<typeof SelectionList<ListItem>>[0]

const selectionSpy = vi.fn<SelectionListProps['onSelectionChanged']>((selection) => {
	console.debug(`TEST: ${selection.length} items selected`)
})

const props: SelectionListProps = {
	items: testItems.map((i, idx) => ({ selected: false, index: idx, label: i.name, value: i })),
	onSelectionChanged: selectionSpy,
}
describe('<SelectionList />', () => {
	test('Renders', async () => {
		const app = await herbRender(<SelectionList {...props} />)
		expect(app).toBeDefined()
		expect(app.queryAllByTestId(/item-\d+/i)).toHaveLength(testItems.length)
	})

	test('Updates the icon when selection changes', async () => {
		const app = await herbRender(<SelectionList {...props} />)
		const item = testItems[Math.floor(Math.random() * (testItems.length - 1))]
		const itemElement = app.getByTestId(`list-item-${item._id}`)
		const icon = app.getByTestId(`list-icon-${item._id}`)

		expect(itemElement).not.toBeSelected()
		expect(icon).toHaveProp('name', uncheckedName)

		await userEvent.press(itemElement)

		expect(itemElement).toBeSelected()
		expect(icon).toHaveProp('name', checkedName)
		expect(selectionSpy.mock.lastCall?.[0]).toEqual([expect.objectContaining({ index: +item._id })])
	})

	test('Select Single Item', async () => {
		const app = await herbRender(<SelectionList {...props} />)

		const item1 = testItems[Math.floor(Math.random() * (testItems.length - 1))]
		const removeItem1 = ({ _id }: ListItem) => _id != item1._id
		const item2 =
			testItems.filter(removeItem1)[Math.floor(Math.random() * (testItems.filter(removeItem1).length - 1))]

		const item1Element = await app.findByTestId(`list-item-${item1._id}`)
		const item2Element = await app.findByTestId(`list-item-${item2._id}`)
		const icon1 = await app.findByTestId(`list-icon-${item1._id}`)
		const icon2 = await app.findByTestId(`list-icon-${item2._id}`)

		expect(icon1).toHaveProp('name', uncheckedName)
		expect(icon2).toHaveProp('name', uncheckedName)
		expect(item1Element).not.toBeSelected()
		expect(item2Element).not.toBeSelected()

		await userEvent.press(item1Element)
		await userEvent.press(item2Element)

		expect(icon1).toHaveProp('name', uncheckedName)
		expect(icon2).toHaveProp('name', checkedName)

		expect(item1Element).not.toBeSelected()
		expect(item2Element).toBeSelected()

		expect(selectionSpy).toHaveBeenCalledTimes(2)
		expect(selectionSpy.mock.lastCall?.[0]).toHaveLength(1)
		expect(selectionSpy.mock.lastCall?.[0]).not.toEqual([expect.objectContaining({ index: +item1._id })])
		expect(selectionSpy.mock.lastCall?.[0]).toEqual([expect.objectContaining({ index: +item2._id })])
	})

	test('Select Multiple Items', async () => {
		const item1 = testItems[Math.floor(Math.random() * (testItems.length - 1))]
		const filterItem1 = ({ _id }: ListItem) => _id != item1._id
		const item2 =
			testItems.filter(filterItem1)[Math.floor(Math.random() * (testItems.filter(filterItem1).length - 1))]

		const app = await herbRender(
			<SelectionList
				multiple
				{...props}
			/>
		)

		const item1Element = await app.findByTestId(`list-item-${item1._id}`)
		const item2Element = await app.findByTestId(`list-item-${item2._id}`)
		const icon1 = await app.findByTestId(`list-icon-${item1._id}`)
		const icon2 = await app.findByTestId(`list-icon-${item2._id}`)

		expect(icon1).toHaveProp('name', uncheckedName)
		expect(icon2).toHaveProp('name', uncheckedName)
		expect(item1Element).not.toBeSelected()
		expect(item2Element).not.toBeSelected()

		await userEvent.press(item1Element)
		await userEvent.press(item2Element)

		expect(selectionSpy).toHaveBeenCalledTimes(2)
		expect(selectionSpy.mock.lastCall?.[0]).toHaveLength(2)
		expect(selectionSpy.mock.lastCall?.[0]).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ index: +item1._id }),
				expect.objectContaining({ index: +item2._id }),
			])
		)

		expect(icon1).toHaveProp('name', checkedName)
		expect(icon2).toHaveProp('name', checkedName)
		expect(item2Element).toBeSelected()
		expect(item1Element).toBeSelected()
	})
})
