import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRestaurantById, getMenuSections } from '../data/restaurants';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import CartBar from '../components/CartBar';
import DietaryBadges from '../components/DietaryBadges';

export function RestaurantMenuScreen({ restaurantId }: { restaurantId: string }) {
  const { state, navigateBack, openProduct, setActiveMenuTab } = useNavigation();
  const { items } = useCart();
  const { isFavorite, toggleFavorite } = useUser();
  const { showToast } = useToast();
  const restaurant = getRestaurantById(restaurantId);
  const sections = getMenuSections(restaurantId);
  const [activeSection, setActiveSection] = useState(sections[0] || 'Popular');
  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs: Record<string, View | null> = {};

  const fav = isFavorite(restaurantId);
  const cartItemsForThisRestaurant = items.filter(i => i.restaurantId === restaurantId);
  const cartCount = cartItemsForThisRestaurant.reduce((sum, i) => sum + i.quantity, 0);

  const handleFavorite = () => {
    toggleFavorite(restaurantId);
    showToast(fav ? 'Removed from favorites' : 'Added to favorites');
  };

  if (!restaurant) return null;

  const scrollToSection = (section: string) => {
    const el = sectionRefs[section];
    if (el && scrollRef.current) {
      // Would need measure to scroll properly
    }
  };

  const handleAddToCart = (item: any) => {
    openProduct(restaurantId, item.id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* Header with image */}
        <View style={styles.header}>
          <Image source={{ uri: restaurant.coverImage }} style={styles.heroImage} />
          <View style={styles.headerOverlay} />
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
              <Ionicons name="arrow-back" size={24} color="#171717" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleFavorite}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? '#FF2B2B' : '#171717'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share" size={24} color="#171717" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant info */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
            <Text style={styles.ratingCount}>({restaurant.ratingCount.toLocaleString()})</Text>
            <Text style={styles.deliveryTime}>
              <Ionicons name="time" size={14} color="#6B7280" />
              <Text style={styles.deliveryTimeText}> {restaurant.deliveryTime}</Text>
            </Text>
          </View>
        </View>

        {/* Menu tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {sections.map(section => (
            <TouchableOpacity
              key={section}
              style={[styles.tab, activeSection === section && styles.tabActive]}
              onPress={() => setActiveSection(section)}
            >
              <Text style={[styles.tabText, activeSection === section && styles.tabTextActive]}>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.tab, state.activeMenuTab === 'reviews' && styles.tabActive]}
            onPress={() => setActiveMenuTab('reviews')}
          >
            <Text style={[styles.tabText, state.activeMenuTab === 'reviews' && styles.tabTextActive]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Menu items */}
        {state.activeMenuTab === 'menu' && (
          <View style={styles.menuSection}>
            {sections.map(section => (
              <View key={section} style={styles.section}>
                <Text style={styles.sectionTitle}>{section}</Text>
                {restaurant.menu
                  .filter(item => item.section === section)
                  .map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleAddToCart(item)}
                    >
                      <View style={styles.menuItemImage}>
                        <Image source={{ uri: item.image }} style={styles.menuImage} />
                        <TouchableOpacity style={styles.addButton}>
                          <Ionicons name="add" size={20} color="#FF2B2B" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.menuItemInfo}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description}</Text>
                        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                        {item.dietaryTags && item.dietaryTags.length > 0 && (
                          <DietaryBadges tags={item.dietaryTags} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        )}

        {state.activeMenuTab === 'reviews' && (
          <View style={styles.reviewsSection}>
            {/* Rating overview */}
            <View style={styles.ratingOverview}>
              <View style={styles.ratingBig}>
                <Text style={styles.ratingBigText}>{restaurant.rating}</Text>
              </View>
              <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map(star => (
                  <View key={star} style={styles.ratingRow}>
                    <Text style={styles.ratingNumber}>{star}</Text>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingBarFill, { width: `${restaurant.ratingBreakdown[star as keyof typeof restaurant.ratingBreakdown] || 0}%` }]} />
                    </View>
                    <Text style={styles.ratingPercent}>
                      {restaurant.ratingBreakdown[star as keyof typeof restaurant.ratingBreakdown]}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Individual reviews */}
            <View style={styles.reviewsList}>
              {restaurant.reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerInitial}>{review.author[0]}</Text>
                    </View>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.author}</Text>
                      <Text style={styles.reviewerDate}>{review.date}</Text>
                    </View>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Ionicons key={s} name={s <= review.rating ? 'star' : 'star-outline'} size={14} color={s <= review.rating ? '#F59E0B' : '#E5E7EB'} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                  <TouchableOpacity style={styles.helpfulButton}>
                    <Ionicons name="thumbs-up" size={14} color="#6B7280" />
                    <Text style={styles.helpfulText}> {review.helpful}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {cartCount > 0 && state.activeMenuTab === 'menu' && (
        <CartBar restaurantId={restaurantId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flexGrow: 1 },
  header: { position: 'relative' },
  heroImage: { width: '100%', height: 280 },
  headerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.3)' },
  headerButtons: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, marginLeft: 8 },
  infoSection: { paddingHorizontal: 20, paddingVertical: 16 },
  restaurantName: { fontSize: 22, fontWeight: '700', color: '#171717' },
  restaurantCuisine: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ratingBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
  ratingCount: { fontSize: 13, color: '#6B7280' },
  deliveryTime: { fontSize: 13, color: '#6B7280', flexDirection: 'row', alignItems: 'center', gap: 4 },
  deliveryTimeText: {},
  tabsRow: { paddingHorizontal: 20, marginBottom: 16, maxHeight: 40 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: 'white', marginRight: 8 },
  tabActive: { backgroundColor: '#171717' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  tabTextActive: { color: 'white' },
  menuSection: { paddingHorizontal: 20, paddingBottom: 32, gap: 20 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#171717' },
  menuItem: { flexDirection: 'row', gap: 12, backgroundColor: 'white', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  menuItemImage: { position: 'relative' },
  menuImage: { width: 80, height: 80, borderRadius: 12 },
  addButton: { position: 'absolute', bottom: -8, right: -8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  menuItemInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  menuItemName: { fontSize: 15, fontWeight: '600', color: '#171717' },
  menuItemDescription: { fontSize: 13, color: '#6B7280' },
  menuItemPrice: { fontSize: 15, fontWeight: '700', color: '#171717', marginTop: 4 },
  reviewsSection: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },
  ratingOverview: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  ratingBig: { alignItems: 'center', marginBottom: 16 },
  ratingBigText: { fontSize: 36, fontWeight: '700', color: '#171717' },
  ratingBreakdown: { gap: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingNumber: { fontSize: 12, color: '#6B7280', width: 16 },
  ratingBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  ratingBarFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 4 },
  ratingPercent: { fontSize: 12, color: '#6B7280', width: 40, textAlign: 'right' },
  reviewsList: { gap: 16 },
  reviewCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  reviewerInitial: { fontSize: 14, fontWeight: '700', color: '#171717' },
  reviewerInfo: { flex: 1 },
  reviewerName: { fontSize: 14, fontWeight: '600', color: '#171717' },
  reviewerDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  stars: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 14, color: '#374151', lineHeight: 22 },
  helpfulButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, padding: 4 },
  helpfulText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
});

export default RestaurantMenuScreen;
