import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories, restaurants } from '../data/restaurants';
import StoreCard from '../components/StoreCard';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';

export function HomeScreen() {
  const { state, navigateToRestaurant, navigateToScreen, setActiveCategory, setShowAddressPicker } = useNavigation();
  const { favorites, selectedAddress } = useUser();
  const [searchValue, setSearchValue] = useState('');

  const filtered = state.activeCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.categories.includes(state.activeCategory));

  const dashPassRestaurants = restaurants.filter(r => r.dashPass);
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));

  const handleSearchFocus = () => {
    navigateToScreen('search');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.locationRow}>
        <TouchableOpacity onPress={() => setShowAddressPicker(true)} style={styles.locationButton}>
          <Ionicons name="location" size={16} color="#FF2B2B" />
          <View>
            <Text style={styles.addressText}>
              {selectedAddress ? selectedAddress.street : 'Set Address'}
            </Text>
            <Text style={styles.addressSubtext}>
              {selectedAddress ? selectedAddress.city : 'Tap to choose'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.searchBar} onPress={handleSearchFocus}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <Text style={styles.searchPlaceholder}>Search restaurants, dishes...</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            style={[
              styles.categoryChip,
              state.activeCategory === cat.id && styles.categoryChipActive
            ]}
          >
            <Text style={[
              styles.categoryText,
              state.activeCategory === cat.id && styles.categoryTextActive
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButtonDashPass}>
          <Ionicons name="crown" size={16} color="white" />
          <Text style={styles.actionButtonDashPassText}>DashPass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonSecondary}>
          <Ionicons name="bicycle" size={16} color="#171717" />
          <Text style={styles.actionButtonSecondaryText}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonSecondary}>
          <Ionicons name="star" size={16} color="#171717" />
          <Text style={styles.actionButtonSecondaryText}>Top Rated</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dashPassCard}>
        <View style={styles.dashPassBadge}>
          <Text style={styles.dashPassBadgeText}>DASHPASS EXCLUSIVE</Text>
        </View>
        <Text style={styles.dashPassTitle}>Save $10 on your next 3 orders</Text>
        <Text style={styles.dashPassSubtext}>Zero delivery fees on orders $12+</Text>
        <Text style={styles.dashPassCode}>Use code WELCOME10 for 10% off</Text>
      </View>

      {state.activeCategory === 'all' && favoriteRestaurants.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Favorites</Text>
          {favoriteRestaurants.map(restaurant => (
            <StoreCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => navigateToRestaurant(restaurant.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {state.activeCategory === 'all' ? 'Popular Near You' : `${categories.find(c => c.id === state.activeCategory)?.name} Restaurants`}
        </Text>
        {filtered.map(restaurant => (
          <StoreCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => navigateToRestaurant(restaurant.id)}
          />
        ))}
      </View>

      {state.activeCategory === 'all' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DashPass Restaurants</Text>
          {dashPassRestaurants.slice(0, 3).map(restaurant => (
            <StoreCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => navigateToRestaurant(restaurant.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#171717',
  },
  addressSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchBar: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
    flex: 1,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#171717',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryTextActive: {
    color: 'white',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButtonDashPass: {
    flex: 1,
    backgroundColor: '#FF2B2B',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonDashPassText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonSecondaryText: {
    color: '#171717',
    fontSize: 13,
    fontWeight: '600',
  },
  dashPassCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dashPassBadge: {
    backgroundColor: '#FF2B2B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  dashPassBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  dashPassTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  dashPassSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  dashPassCode: {
    fontSize: 12,
    color: '#FF2B2B',
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 12,
  },
});

export default HomeScreen;
