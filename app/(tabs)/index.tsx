import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MOCK_ALERTS, Alert } from '@/constants/mock-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AlertItem from '@/components/AlertItem';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const [alerts, setAlerts] = useState<Alert[]>(() => MOCK_ALERTS.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const loadMoreAlerts = useCallback(() => {
    if (isLoading || alerts.length >= MOCK_ALERTS.length) {
      return;
    }
    setIsLoading(true);
    const nextPage = page + 1;
    const newAlerts = MOCK_ALERTS.slice(0, nextPage * PAGE_SIZE);
    // Simulate network request
    setTimeout(() => {
      setAlerts(newAlerts);
      setPage(nextPage);
      setIsLoading(false);
    }, 500);
  }, [isLoading, page, alerts.length]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="large" />;
  };

  const renderItem = ({ item }: { item: Alert }) => <AlertItem item={item} />;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ThemedText type="title" style={styles.logo}>SnapSentinel</ThemedText>
      </View>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMoreAlerts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingBottom: 30, // Added padding to avoid footer being too close to the edge
  },
});
