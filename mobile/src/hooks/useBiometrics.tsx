import { authenticateAsync, hasHardwareAsync, isEnrolledAsync } from 'expo-local-authentication'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'

// Context whether biometrics is allowed
type BiometricContextType = { available: boolean; register: () => void | Promise<void> }
const BiometricsContext = createContext<BiometricContextType | null>(null)

type Biometrics = {
	available: BiometricContextType['available']
	register: BiometricContextType['register']
	trigger: () => Promise<void>
}
export default function useBiometrics(): Biometrics {
	const ctx = useContext(BiometricsContext)

	if (!ctx) throw new Error('Must be used within a Biometrics Provider')

	const trigger = useCallback(async () => {
		if (!ctx.available) throw new Error('Biometrics not available on this device')

		const res = await authenticateAsync()

		if (res.success != true) {
			res.warning && console.warn('Biometrics Warning: ', res.warning)
			throw res.error
		}
	}, [ctx])

	return { available: ctx.available, register: ctx.register, trigger }
}

type BiometricsProps = PropsWithChildren
export function BiometricsProvider({ children }: BiometricsProps) {
	const [available, setAvailable] = useState(false)

	const register = useCallback(() => {
		setAvailable(true)
	}, [available])

	useEffect(() => {
		async function supportsBiometrics() {
			const [hardware, enrolled] = await Promise.all([
				// Verify they have the hardware
				hasHardwareAsync(),
				// Verify they have biometrics registered on the device
				isEnrolledAsync(),
			])

			console.debug('Hardware? ', hardware)
			console.debug('Enrolled? ', enrolled)
			setAvailable(hardware && enrolled)
		}

		supportsBiometrics()
	}, [])

	return <BiometricsContext.Provider value={{ available, register }}>{children}</BiometricsContext.Provider>
}
