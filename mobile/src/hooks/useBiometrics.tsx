import {
  authenticateAsync,
  hasHardwareAsync,
  isEnrolledAsync,
} from 'expo-local-authentication';
import {useCallback, useState} from 'react';
import {useConfig} from './useConfig';

export default function useBiometrics() {
  //   const [canBiometrics, setCanBiometrics] = useState(false);
  const [config] = useConfig();
  const [available, setAvailable] = useState(config?.biometrics ?? false);

  const triggerBiometrics = useCallback(async () => {
    async function supportsBiometrics() {
      const [hardware, enrolled] = await Promise.all([
        // Verify they have the hardware
        hasHardwareAsync(),
        // Verify they have biometrics registered on the device
        isEnrolledAsync(),
      ]);

      console.debug('Hardware? ', hardware);
      console.debug('Enrolled? ', enrolled);
      return hardware && enrolled;
    }

    if (!(await supportsBiometrics())) {
      available && setAvailable(false);
      throw new Error("Biometrics aren't supported on this device");
    }

    const res = await authenticateAsync();

    if (res.success != true) {
      res.warning && console.warn('Biometrics Warning: ', res.warning);
      throw res.error;
    }
  }, [available]);

  return {available, triggerBiometrics};
}
