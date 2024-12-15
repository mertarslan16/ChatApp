import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const LoadingSpinner: React.FC = () => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
