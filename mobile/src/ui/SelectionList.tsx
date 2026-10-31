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
	const selectionChanged = useCallback(
		(item: SelectionItem<T>) => {
			console.debug('Allow Multiple? ', multiple)
			if (!multiple) {
				console.debug('Clearing selection list')
				console.debug(`${items.filter(({ selected }) => selected).length} items selected before...`)
				items.forEach((i) => {
					if (i.index == item.index) return
					i.selected = false
				})
				console.debug(`${items.filter(({ selected }) => selected).length} items selected after...`)
			}

			item.selected = !item.selected

			console.debug('Selected Item Index: ', items.filter(({ selected }) => selected)[0]?.index)
			onSelectionChanged(items.filter((i) => i.selected))
		},
		[items, multiple, onSelectionChanged]
	)

	return (
		<View style={[styles.container, style]}>
			{items.map((item) => {
				console.debug(`Item ${item.index}: `, item.value)
				console.debug(`Item ${item.index} Selected? `, item.selected)
				return (
					<TouchableOpacity
						key={item.index}
						testID={`list-item-${item.index}`}
						style={styles.itemContainer}
						onPress={() => selectionChanged(item)}>
						<Icon
							testID={`list-icon-${item.index}`}
							name={item.selected ? 'checkmark.circle' : 'checkmark.bubble'}
							style={styles.icon}
						/>
						{/* {renderItem(item)} */}
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
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		borderWidth: 1,
	},
})
