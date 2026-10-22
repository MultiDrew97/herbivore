import { herbRender } from '@spec/helpers'
import ImageCarousel, { ImageCarouselProps } from '@src/ui/ImageCarousel'
import { fireEvent, screen } from '@testing-library/react-native'
import { TestInstance } from 'test-renderer'

const scrollID = 'carousel-scroll'
// const imagePattern = /carousel-image-\d/i
const indicatorPattern = /carousel-indicator-\d/i
const images: ImageCarouselProps['images'] = [
	{
		uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.k6L8MIBFHA5qwAUF7Rej8QHaHa%3Fpid%3DApi&f=1&ipt=aefeabe01eb213710a1f0e534ea066a237c4177f30595239a17289fa20044719&ipo=images',
	},
	{
		uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.D_xQ_JMX3llcx5AIBAlAoAHaHa%3Fpid%3DApi&f=1&ipt=31a272ba2e99994c5a5579fd8c95bfeceb42afba49606bdeaa41affb1ceb92d4&ipo=images',
	},
	{
		uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.HFArXQsIpTyqGe0tUblqdAHaHa%3Fpid%3DApi&f=1&ipt=ec805d6330f558c3606f12b96791a3edd8cd1927048cafe9b37faa09a7669a9e&ipo=images',
	},
]
const props = {
	images,
} as ImageCarouselProps

async function swipe(comp: TestInstance, dir: 'left' | 'right' | 'none') {
	await fireEvent(comp, 'scrollEndDrag', {
		nativeEvent: {
			velocity: {
				x: dir == 'none' ? 0 : dir == 'left' ? -1 : 1,
			},
		},
	})
}

describe('<ImageCarousel />', () => {
	test('Image Swiping', async () => {
		props.color = 'red'
		await herbRender(<ImageCarousel {...props} />)
		const scroll = screen.getByTestId(scrollID)

		for (let i = 0; i < images.length; i++) {
			const img = screen.queryByTestId(`carousel-image-${i % images.length}`)
			const indicator = screen.queryByTestId(`carousel-indicator-${i % images.length}`)

			expect(img).toBeOnTheScreen()
			expect(indicator).toHaveProp('name', 'inset.filled.circle')
			await swipe(scroll, 'right')
		}

		for (let i = images.length - 1; i >= 0; i--) {
			await swipe(scroll, 'left')
			const img = screen.queryByTestId(`carousel-image-${i % images.length}`)
			const indicator = screen.queryByTestId(`carousel-indicator-${i % images.length}`)

			expect(img).toBeOnTheScreen()
			expect(indicator).toHaveProp('name', 'inset.filled.circle')
		}

		// Not in image list size
		expect(() => screen.getByTestId(`carousel-image-${images.length + 1}`)).toThrow()

		// Sim swipe of carousel forward
		await swipe(scroll, 'right')

		expect(screen.queryByTestId('carousel-image-0')).toBeNull()
		expect(screen.queryByTestId('carousel-image-1')).toBeOnTheScreen()
		expect(screen.queryByTestId('carousel-indicator-0')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('carousel-indicator-1')).toHaveProp('name', 'inset.filled.circle')

		// Sim swipe of carousel backward
		await swipe(scroll, 'left')

		expect(screen.queryByTestId('carousel-image-1')).toBeNull()
		expect(screen.queryByTestId('carousel-image-0')).toBeOnTheScreen()
		expect(screen.queryByTestId('carousel-indicator-1')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('carousel-indicator-0')).toHaveProp('name', 'inset.filled.circle')

		// Sim 'empty' swipe
		await swipe(scroll, 'none')

		expect(screen.queryByTestId('carousel-image-1')).toBeNull()
		expect(screen.queryByTestId('carousel-image-3')).toBeNull()
		expect(screen.queryByTestId('carousel-image-0')).toBeOnTheScreen()
		expect(screen.queryByTestId('carousel-indicator-1')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('carousel-indicator-2')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('carousel-indicator-0')).toHaveProp('name', 'inset.filled.circle')
	})

	test('Hidden Indicators', async () => {
		await herbRender(<ImageCarousel {...props} />)
		expect(screen.queryAllByTestId(indicatorPattern)).toHaveLength(images.length)

		props.hideIndicators = true
		await screen.rerender(<ImageCarousel {...props} />)

		expect(screen.queryAllByTestId(indicatorPattern)).toHaveLength(0)
	})

	test('Images Reset', async () => {
		const app = await herbRender(<ImageCarousel {...props} />)

		const scroll = screen.getByTestId(scrollID)

		await swipe(scroll, 'right')

		expect(screen.queryByTestId('carousel-image-0')).toBeNull()
		expect(screen.queryByTestId('carousel-image-1')).not.toBeNull()

		await swipe(scroll, 'right')

		expect(screen.queryByTestId('carousel-image-1')).toBeNull()
		expect(screen.queryByTestId('carousel-image-2')).not.toBeNull()

		await app.rerender(<ImageCarousel images={images.slice(0, 2)} />)
		expect(screen.queryByTestId('carousel-image-2')).toBeNull()
		expect(screen.queryByTestId('carousel-image-0')).not.toBeNull()
	})
})
