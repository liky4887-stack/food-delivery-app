import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { getRestaurantById } from '../data/restaurants';
import StoreCard from '../components/StoreCard';

export function OrdersScreen() {
  const { state, navigateToScreen, navigateToRestaurant, confirmOrder } = useNavigation();
  const { orderHistory } = useUser();
  const { loadCartFromOrder } = useCart();

  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = orderHistory.filter(o => o.stage < 3);
  const pastOrders = orderHistory.filter(o => o.stage >= 3);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const stageLabels = ['Placed', 'Preparing', 'On the Way', 'Delivered'];

  const handleReorder = (orderId: string) => {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    loadCartFromOrder(order.items);
    navigateToRestaurant(order.restaurantId);
  };

  if (orderHistory.length === 0) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Orders</Text>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Your past and active orders will appear here once you place them.</Text>
          <View style={styles.restaurantList}>
            <Text style={styles.sectionTitle}>Hungry?</Text>
            {/* Popular restaurants */}
          </View>
        </View>
      </ScrollView>
    );
  }

  const currentOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Orders</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>Past</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {currentOrders.map(order => {
          const restaurant = getRestaurantById(order.restaurantId);
          return (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => confirmOrder(order.id)}
            >
              <View style={styles.orderHeader}>
                {restaurant && (
                  <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                )}
                <View style={styles.orderInfo}>
                  <Text style={styles.orderRestaurant}>{order.restaurantName}</Text>
                  <Text style={styles.orderTime}>{formatTime(order.placedAt)}</Text>
                </View>
                <View style={[styles.stageBadge, { backgroundColor: order.stage === 3 ? '#DCFCE7' : '#FEF2F2' }]}>
                  <Text style={[styles.stageText, { color: order.stage === 3 ? '#16A34A' : '#DC2626' }]}>
                    {stageLabels[order.stage]}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderItems}>
                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              </Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                {order.stage < 3 && (
                  <TouchableOpacity onPress={() => handleReorder(order.id)}>
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: '700', color: '#171717', marginBottom: 16 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  tabActive: { backgroundColor: '#171717' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: 'white' },
  list: { gap: 12, marginBottom: 32 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#171717', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
  restaurantList: { width: '100%', marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#171717', marginBottom: 12 },
  orderCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', gap: 8 },
  orderHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  restaurantImage: { width: 48, height: 48, borderRadius: 12 },
  orderInfo: { flex: 1 },
  orderRestaurant: { fontSize: 15, fontWeight: '700', color: '#171717' },
  orderTime: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  stageText: { fontSize: 12, fontWeight: '600' },
  orderItems: { fontSize: 13, color: '#6B7280' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  orderTotal: { fontSize: 16, fontWeight: '700', color: '#171717' },
  reorderText: { fontSize: 14, fontWeight: '600', color: '#FF2B2B' },
});

export default OrdersScreen;
