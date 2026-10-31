import SelectionList from '@src/ui/SelectionList'
import { StyleSheet, Text, View } from 'react-native'

const values = [
	{ _id: '1', name: 'Jane Roe' },
	{ _id: '2', name: 'John Doe' },
	{ _id: '3', name: 'Naname Sambade' },
]
export function Tester() {
	return (
		<View style={styles.container}>
			<Text>Test App</Text>
			<SelectionList
				items={values.map((i, idx) => ({ selected: false, index: idx, label: i.name, value: i }))}
				onSelectionChanged={(selected) => {
					console.debug(`${selected.length} items selected`)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignSelf: 'center',
	},
})

import { useColorScheme } from 'react-native'
import { StrictMode } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'

export default function App() {
	const scheme = useColorScheme()
	console.debug('Current Scheme: ', scheme)
	return (
		<StrictMode>
			<ThemeProvider value={scheme != 'dark' ? DefaultTheme : DarkTheme}>
				<Tester />
			</ThemeProvider>
		</StrictMode>
	)
}
