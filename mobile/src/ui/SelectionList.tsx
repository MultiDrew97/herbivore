import { JSX, PropsWithChildren, PropsWithoutRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

type SelectionListProps<T> = PropsWithChildren<{
	data: T[]
	renderItem: (item: T, index: number) => JSX.Element
	style?: StyleProp<ViewStyle>
}>
export default function SelectionList<T>({ data, renderItem, style }: SelectionListProps<T>) {
	return <View style={[styles.container, style]}>{data.map(renderItem)}</View>
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
	},
})
