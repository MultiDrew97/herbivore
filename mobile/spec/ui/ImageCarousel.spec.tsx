import { fireEvent, render, screen } from '@testing-library/react-native'
import { handleRenderError } from '@spec/helpers'
import ImageCarousel from '@src/ui/ImageCarousel'

type CarouselProps = Parameters<typeof ImageCarousel>[0]
const testImages: CarouselProps['images'] = [
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

async function swipe(comp: any, dir: 'left' | 'right' | 'none') {
	await fireEvent(comp, 'scrollEndDrag', {
		nativeEvent: {
			velocity: {
				x: dir == 'none' ? 0 : dir == 'left' ? -1 : 1,
			},
		},
	})
}

describe('<ImageCarousel />', () => {
	test('Correct Image Shown', async () => {
		await render(
			<ImageCarousel
				images={testImages}
				color='red'
			/>
		).catch(handleRenderError)

		expect(screen.queryByTestId('image-0')).toBeOnTheScreen()
		expect(screen.queryByTestId('image-1')).toBeNull()
		expect(screen.queryByTestId('indicator-0')).toHaveProp('name', 'inset.filled.circle')

		expect(() => screen.getByTestId(`image-${1}`)).toThrow()

		const scroll = screen.getByTestId('carousel-scroll')

		// Sim swipe of carousel forward
		await swipe(scroll, 'right')

		expect(screen.queryByTestId('image-0')).toBeNull()
		expect(screen.queryByTestId('image-1')).toBeOnTheScreen()
		expect(screen.queryByTestId('indicator-0')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('indicator-1')).toHaveProp('name', 'inset.filled.circle')

		// Sim swipe of carousel backward
		await fireEvent(scroll, 'scrollEndDrag', {
			nativeEvent: {
				velocity: {
					x: -1,
				},
			},
		})

		expect(screen.queryByTestId('image-1')).toBeNull()
		expect(screen.queryByTestId('image-0')).toBeOnTheScreen()
		expect(screen.queryByTestId('indicator-1')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('indicator-0')).toHaveProp('name', 'inset.filled.circle')

		// Sim 'empty' swipe
		await fireEvent(scroll, 'scrollEndDrag', {
			nativeEvent: {
				velocity: {
					x: 0,
				},
			},
		})

		expect(screen.queryByTestId('image-1')).toBeNull()
		expect(screen.queryByTestId('image-3')).toBeNull()
		expect(screen.queryByTestId('image-0')).toBeOnTheScreen()
		expect(screen.queryByTestId('indicator-1')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('indicator-2')).toHaveProp('name', 'circle')
		expect(screen.queryByTestId('indicator-0')).toHaveProp('name', 'inset.filled.circle')
	})

	test('Swipe Animation', async () => {
		await render(<ImageCarousel images={testImages} />).catch(handleRenderError)

		expect(screen.queryByTestId('carousel-scroll')).toBeOnTheScreen()

		expect(screen.queryByTestId('image-0')).toBeOnTheScreen()
	})
})
