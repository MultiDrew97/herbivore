import { PropsWithoutRef, useCallback, useEffect, useState } from 'react'
import {
	ColorValue,
	Image,
	ImageSourcePropType,
	ImageStyle,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native'
import IconSymbol from '@src/ui/IconSymbol'

type ImageCarouselProps = PropsWithoutRef<{
	images: ImageSourcePropType[]
	style?: StyleProp<ViewStyle>
	imageStyle?: StyleProp<ImageStyle>
	color?: ColorValue
}>
export default function ImageCarousel({ images, style, imageStyle, color }: ImageCarouselProps) {
	const [idx, setIdx] = useState<number>(0)

	const changeImage = useCallback(
		(_event: NativeSyntheticEvent<NativeScrollEvent>) => {
			console.debug('Changing image...')

			console.debug('Type - ', _event.nativeEvent.velocity)

			// No velocity present, so don't scroll
			if (!_event.nativeEvent.velocity) return

			// Velocity was 0, so don't change image
			if (_event.nativeEvent.velocity.x == 0) return

			if (_event.nativeEvent.velocity.x > 0) {
				console.debug('Changing to next image...')
				setIdx(idx >= images.length - 1 ? 0 : (idx + 1) % images.length)
			} else {
				console.debug('Changing to previous image...')
				setIdx(idx <= 0 ? images.length - 1 : Math.abs(idx - 1) % images.length)
			}
		},
		[images, idx]
	)

	useEffect(() => {
		// Used to reset the index when the images are changed
		setIdx(0)
	}, [images])

	return (
		<View
			testID='carousel'
			style={[styles.container, style]}>
			<ScrollView
				horizontal
				testID='carousel-scroll'
				onScrollEndDrag={changeImage}
				scrollEnabled={images.length > 1}
				contentContainerStyle={styles.imgContainer}>
				{images.map(
					(img, i) =>
						idx == i && (
							<Image
								key={i}
								testID={`image-${i}`}
								style={[styles.imgs, imageStyle]}
								source={img}
							/>
						)
				)}
			</ScrollView>
			<View style={styles.countContainer}>
				{images.map((_, i) => (
					<IconSymbol
						key={i}
						testID={`indicator-${i}`}
						name={idx != i ? 'circle' : 'inset.filled.circle'}
						color={color ?? 'blue'}
						size={16}
					/>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { alignSelf: 'center' } as ViewStyle,
	imgs: { maxHeight: '100%', maxWidth: '100%', resizeMode: 'cover', borderRadius: 25 } as ImageStyle,
	imgContainer: { height: '100%', width: '100%', alignSelf: 'center', justifyContent: 'center', flexGrow: 1 },
	countContainer: { flexDirection: 'row', flexShrink: 1, justifyContent: 'center' },
})
