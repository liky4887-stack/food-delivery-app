import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { restaurants } from '../data/restaurants';
import StoreCard from '../components/StoreCard';
import { useNavigation } from '../context/NavigationContext';
import { getDishResults } from '../data/restaurants';

export function SearchScreen() {
  const { navigateToRestaurant, openProduct, setSearchQuery, state } = useNavigation();
  const [query, setQuery] = useState(state.searchQuery);
  const [recentSearches] = useState(['pizza', 'sushi', 'burger', 'tacos']);
  const [popularSearches] = useState(['best pizza near me', 'vegetarian options', 'food delivery']);

  const dishResults = getDishResults(query);
  const filteredResults = restaurants.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(query.toLowerCase())
  );

  const activeFilter = query ? (dishResults.length > 0 ? 'dishes' : 'restaurants') : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#171717" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search restaurants or dishes..."
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!query ? (
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.tagsRow}>
              {recentSearches.map(term => (
                <TouchableOpacity key={term} style={styles.tag} onPress={() => setQuery(term)}>
                  <Text style={styles.tagText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.tagsRow}>
              {popularSearches.map(term => (
                <TouchableOpacity key={term} style={[styles.tag, styles.popularTag]} onPress={() => setQuery(term)}>
                  <Text style={styles.popularTagText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Restaurants</Text>
            <View style={styles.list}>
              {restaurants.map(r => (
                <StoreCard
                  key={r.id}
                  restaurant={r}
                  onPress={() => navigateToRestaurant(r.id)}
                />
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View>
          {activeFilter === 'dishes' && dishResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dishes ({dishResults.length})</Text>
              <View style={styles.list}>
                {dishResults.map(({ item, restaurant }) => (
                  <TouchableOpacity
                    key={`${restaurant.id}-${item.id}`}
                    style={styles.dishCard}
                    onPress={() => openProduct(restaurant.id, item.id)}
                  >
                    <Image source={{ uri: item.image }} style={styles.dishImage} />
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishName}>{item.name}</Text>
                      <Text style={styles.dishRestaurant}>{restaurant.name}</Text>
                      <View style={styles.dishRow}>
                        <Text style={styles.dishPrice}>${item.price.toFixed(2)}</Text>
                        {item.itemRating && (
                          <Text style={styles.dishRating}>{item.itemRating}</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {activeFilter !== 'dishes' && filteredResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Restaurants ({filteredResults.length})</Text>
              <View style={styles.list}>
                {filteredResults.map(r => (
                  <StoreCard
                    key={r.id}
                    restaurant={r}
                    onPress={() => navigateToRestaurant(r.id)}
                  />
                ))}
              </View>
            </View>
          )}

          {filteredResults.length === 0 && dishResults.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No results for "{query}"</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#171717',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  popularTag: {
    backgroundColor: '#FEF2F2',
  },
  popularTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
  list: {
    gap: 12,
  },
  dishCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dishImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171717',
  },
  dishRestaurant: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
  },
  dishRating: {
    fontSize: 12,
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});

export default SearchScreen;
