import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Restaurant } from '../data/restaurants';

interface StoreCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export function StoreCard({ restaurant, onPress }: StoreCardProps) {
  const rating = restaurant.rating;
  const ratingCount = restaurant.ratingCount;
  const deliveryTime = restaurant.deliveryTime;
  const deliveryFee = restaurant.deliveryFee;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            // Toggle favorite
          }}
          style={styles.heartButton}
        >
          <MaterialCommunityIcons
            name="heart"
            size={14}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.ratingCount}>({ratingCount})</Text>
          <Text style={styles.bullet}>·</Text>
          <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
          <Text style={styles.deliveryTime}>{deliveryTime}</Text>
          <Text style={styles.bullet}>·</Text>
          <MaterialCommunityIcons name="bike" size={12} color="#6B7280" />
          <Text style={styles.deliveryTime}>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</Text>
        </View>
        <View style={styles.tags}>
          {restaurant.freeDelivery && (
            <View style={[styles.tag, styles.freeTag]}>
              <Text style={styles.freeTagText}>Free Delivery</Text>
            </View>
          )}
          {restaurant.promo && <Text style={styles.promo}>{restaurant.promo}</Text>}
          <Text style={styles.distance}>{restaurant.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
  },
  ratingCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  bullet: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  deliveryTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  freeTag: {
    backgroundColor: '#DCFCE7',
  },
  freeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  promo: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  distance: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 'auto',
  },
});

export default StoreCard;
