import {ThemedText} from '@components/ThemedText';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LogoIcon from '@components/ui/LogoIcon';
import ExpoConsts from 'expo-constants';

export default function PCSplashScreen() {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <LogoIcon key="logo" size={200} style={styles.logo} />

      <ThemedText key="name" style={styles.name}>
        {ExpoConsts.expoConfig.name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  logo: {},
  name: {},
});
