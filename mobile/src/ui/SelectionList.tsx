import { PropsWithChildren, useCallback, useState } from 'react'
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Icon from './Icon'

type SelectionItem<T> = {
	/** Whether the item is currently selected */
	selected: boolean
	/** The index of the item. Acts like an ID value */
	index: number
	/** The string to display in the list */
	label: string
	/** The actual value related to the  */
	value: T
}
type SelectionListProps<T> = PropsWithChildren<{
	multiple?: boolean
	items: SelectionItem<T>[]
	onSelectionChanged: (selected: SelectionItem<T>[]) => void
	style?: StyleProp<ViewStyle>
}>
export default function SelectionList<T>({ items, style, onSelectionChanged, multiple }: SelectionListProps<T>) {
	const [currentSel, setCurrentSel] = useState<Set<number>>(
		() => new Set(items.filter(({ selected }) => selected).map(({ index }) => index))
	)

	const selectionChanged = useCallback(
		(item: SelectionItem<T>) => {
			console.debug('Allow Multiple? ', multiple)
			const newSel = multiple ? new Set(currentSel) : new Set<number>()

			const updateSel = (currentSel.has(item.index) ? newSel.delete : newSel.add).bind(newSel)

			updateSel(item.index)

			setCurrentSel(newSel)
			onSelectionChanged(
				items
					.filter(({ index }) => newSel.has(index))
					.map((selectedItem): SelectionItem<T> => ({ ...selectedItem, selected: true }))
			)
		},
		[items, multiple, onSelectionChanged, currentSel]
	)

	return (
		<View style={[styles.container, style]}>
			{items.map((item) => {
				return (
					<TouchableOpacity
						key={item.index}
						testID={`list-item-${item.index}`}
						aria-selected={currentSel.has(item.index)}
						aria-checked={currentSel.has(item.index)}
						style={styles.itemContainer}
						onPress={() => selectionChanged(item)}>
						<Icon
							testID={`list-icon-${item.index}`}
							name={currentSel.has(item.index) ? 'checkmark' : 'square'}
							style={styles.icon}
						/>
						<Text key={item.index}>{item.label}</Text>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		borderWidth: 1,
	},
	icon: {
		marginInlineEnd: 4,
	},
	itemContainer: {
		alignSelf: 'flex-start',
		borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
})
