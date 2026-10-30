import SelectionList from '@src/ui/SelectionList'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import { StrictMode } from 'react'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'

const values = [
	{ _id: '1', name: 'Jane Roe' },
	{ _id: '2', name: 'John Doe' },
	{ _id: '3', name: 'Naname Sambade' },
]
export function TestApp() {
	return (
		<View style={styles.container}>
			<Text>Test App</Text>
			<SelectionList
				items={values.map((i, idx) => ({ selected: false, index: idx, label: i.name, value: i }))}
				// renderItem={(item) => <Text key={item.index}>{item.value.name}</Text>}
				onSelectionChanged={(selected) => {
					console.debug(`${selected.length} items selected`)
				}}
			/>
		</View>
	)
}

export default function TestAppWrapper() {
	const scheme = useColorScheme()
	console.debug('Current Scheme: ', scheme)
	return (
		<StrictMode>
			<ThemeProvider value={scheme != 'dark' ? DefaultTheme : DarkTheme}>
				<TestApp />
			</ThemeProvider>
		</StrictMode>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignSelf: 'center',
	},
})
