import Icon from '@src/ui/Icon'
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

export type ImageCarouselProps = PropsWithoutRef<{
	/** The images to display within the carousel */
	images: ImageSourcePropType[]
	/** The style of the carousel */
	style?: StyleProp<ViewStyle>
	/** The style to apply to the images */
	imageStyle?: StyleProp<ImageStyle>
	/** The color of the image indicators */
	color?: ColorValue
	/** Whether to hide the indicators */
	hideIndicators?: boolean
}>
export default function ImageCarousel({
	images,
	style,
	imageStyle,
	color,
	hideIndicators = false,
}: ImageCarouselProps) {
	// const idx = useRef(0)
	const [idx, setIdx] = useState<number>(0)

	const changeImage = useCallback(
		(_event: NativeSyntheticEvent<NativeScrollEvent>) => {
			console.debug('Changing image...')

			console.debug('Velocity - ', _event.nativeEvent.velocity)

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
		function reset() {
			// Used to reset the index when the images are changed
			setIdx(0)
		}
		reset()
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
								testID={`carousel-image-${i}`}
								style={[styles.imgs, imageStyle]}
								source={img}
							/>
						)
				)}
			</ScrollView>
			{!hideIndicators && (
				<View style={styles.countContainer}>
					{images.map((_, i) => (
						<Icon
							key={i}
							testID={`carousel-indicator-${i}`}
							name={idx != i ? 'circle' : 'inset.filled.circle'}
							color={color}
							size={16}
						/>
					))}
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: { alignSelf: 'center' } as ViewStyle,
	countContainer: { flexDirection: 'row', flexShrink: 1, justifyContent: 'center' },
	imgContainer: { alignSelf: 'center', flexGrow: 1, height: '100%', justifyContent: 'center', width: '100%' },
	imgs: { maxHeight: '100%', maxWidth: '100%', resizeMode: 'cover', borderRadius: 25 } as ImageStyle,
})
