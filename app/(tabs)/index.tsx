import React from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlerts, type Alert } from '@/hooks/use-alerts';
import AlertItem from '@/components/AlertItem';
import HamburgerMenu from '@/components/HamburgerMenu';

export default function HomeScreen() {
  // Use the custom hook to fetch alert data from the API.
  // This encapsulates all logic for fetching, loading, and error handling.
  const { alerts, isLoading, error } = useAlerts();

  // Show a loading spinner while the initial data is being fetched.
  if (isLoading && !alerts.length) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  // Show an error message if the data fetching fails.
  if (error) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ThemedText>Error fetching alerts.</ThemedText>
        <ThemedText>{error.message}</ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({ item, index }: { item: Alert; index: number }) => (
    <AlertItem item={item} index={index} />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.logo}>SnapSentinel</ThemedText>
      </ThemedView>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        // NOTE: Pagination/infinite scroll is removed for now as the API
        // does not currently support it. A pull-to-refresh could be added here.
      />
      <HamburgerMenu />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3c',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
});

