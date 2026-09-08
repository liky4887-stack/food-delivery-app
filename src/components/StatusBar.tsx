import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function StatusBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.icons}>
        <MaterialCommunityIcons name="signal" size={14} color="#171717" style={styles.icon} />
        <MaterialCommunityIcons name="wifi" size={14} color="#171717" style={styles.icon} />
        <MaterialCommunityIcons name="battery" size={16} color="#171717" style={styles.icon} />
      </View>
      <ExpoStatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171717',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginHorizontal: 2,
  },
});

export default StatusBar;
