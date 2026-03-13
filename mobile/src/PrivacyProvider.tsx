import { Timeouts } from '@herbivore/pcshared/models/users'
import useBiometrics from '@hooks/useBiometrics'
import { useConfig } from '@hooks/useConfig'
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const PrivacyContext = React.createContext<boolean>(false)
PrivacyContext.displayName = 'PrivacyContext'

type PrivacyProviderProps = PropsWithChildren<{
	splashscreen: Element
	onShown?: () => void
	onHidden?: () => void
}>
export default function PrivacyProvider({ children, splashscreen }: PrivacyProviderProps): React.ReactNode {
	const { config } = useConfig()
	const { triggerBiometrics } = useBiometrics()
	const [reauth, setReauth] = useState(React.useContext(PrivacyContext))
	const [showScreen, setShowScreen] = useState(reauth)
	const [timeoutID, setTimeoutID] = useState<number | NodeJS.Timeout>()

	const Lock = useCallback(() => {
		console.info('Privacy timeout reached. Requiring reauth to unlock again')

		setReauth(true)
	}, [])

	const Unlock = useCallback(async () => {
		if (!reauth) return

		console.info('Unlocking app for user...')

		try {
			await triggerBiometrics()
		} catch (err) {
			// Use fallback auth method (i.e. PIN, Pattern, etc.)
			/*
      FIXME: UI/UX & Security

      Update so that if the user can't or chooses not to use biometrics, they
      can get back in using a PIN setup?

      Change it so that it only does this when something is setup?
      - Secure unlock only if PIN/Biometrics are setup?
      */
		}

		setReauth(false)
		setShowScreen(false)
		// updatePrivacyInfo({...privacyInfo, reauth: false});
	}, [reauth, triggerBiometrics])

	const stateChange = useCallback(
		(state: AppStateStatus) => {
			console.debug(state)
			if (state == 'active' && timeoutID) {
				// Stop the reauth timer
				console.debug('Stopping reauth timer')
				clearTimeout(timeoutID)
				setTimeoutID(undefined)
			}

			if (state == 'active' && reauth) {
				// Reauth the user (i.e. FaceID, TouchID, PIN, Password, etc.)
				Unlock()
			}

			if (state != 'active' && config?.privacyTimeout != Timeouts.NEVER && !timeoutID) {
				console.info('Starting timeout: ', config?.privacyTimeout)
				// Start the timer for reauth from privacy screen
				setTimeoutID(setTimeout(Lock, config?.privacyTimeout * 1000 * 60))
			}

			setShowScreen(state != 'active' || reauth)
		},
		[Lock, Unlock, config, reauth, timeoutID],
	)

	useEffect(() => {
		/*
      TODO: Privacy Timeout
        [x] Set a timeout when the state changes from active
        [x] Cancel the timeout when the stte changes back to active only
        [ ] Test that timeout starts, triggers and stops properly
    */
		const sub = AppState.addEventListener('change', stateChange)

		return () => {
			console.info('Cleaning up privacy provider...')
			sub && sub.remove()
		}
	}, [stateChange])

	/**
	 * FIXME: Privacy screening
	 *  Got working so that it can swap between active and inactive effectively. Currently, will go back to unauthed
	 *  screen instead of back where the user was (might be how screens setup in _layout of app). Still work in
	 *  progress, but has a long way to go before usable
	 *    [x] Show splash screen when not active
	 *    [x] When active again, go back to screen they were on
	 *    [x] Make config option to set timeout, if any, before reauthing when not active
	 *        - Make an option in settings for biorecognition (i.e Face/TouchID, fingerprint, retinal, etc.)
	 *    [ ] Make it so that it isn't triggered when setting up FaceID/Biomentrics
	 */

	return (
		<PrivacyContext.Provider value={reauth}>
			{/*
        children has to be first otherwise the privacy screen wont show when it's
        supposed to. Likely related to zIndex values. I'm not sure if it's worth
        worrying about this right now, but adding MAYBE flag for later
        analysis

        MAYBE: Order Change
          - Does it matter that this is in this order?
          - Can it be helped?
      */}
			{children}
			{showScreen && splashscreen}
		</PrivacyContext.Provider>
	)
}
