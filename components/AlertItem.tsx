import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { type Alert } from '@/constants/mock-data';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

type AlertItemProps = {
  item: Alert;
};

const AlertItem = ({ item }: AlertItemProps) => {
  return (
    <Link href={{ pathname: '/modal', params: { imageUrl: item.imageUrl, triggerTerm: item.triggerTerm } }} asChild>
      <Pressable>
        {({ pressed }) => (
          <View style={[styles.container, pressed && styles.pressed]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
            <View style={styles.infoContainer}>
              <ThemedText type="defaultSemiBold">Trigger: {item.triggerTerm}</ThemedText>
              <ThemedText type="secondary" style={styles.dateTimeText}>
                {item.date} at {item.time}
              </ThemedText>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  dateTimeText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default AlertItem;
