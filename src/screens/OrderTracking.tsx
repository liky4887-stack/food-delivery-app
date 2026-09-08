import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../context/NavigationContext';
import { useUser, PastOrder } from '../context/UserContext';

export function OrderTracking({ order }: { order: PastOrder }) {
  const { updateOrderStage } = useUser();
  const { navigateToScreen } = useNavigation();
  const [stage, setStage] = useState(order.stage);
  const [courierProgress, setCourierProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stages = [
    { icon: MaterialCommunityIcons, iconName: 'check-circle-outline', label: 'Order Placed', desc: 'Restaurant received your order', color: '#6B7280' },
    { icon: MaterialCommunityIcons, iconName: 'chef-hat', label: 'Preparing', desc: 'Your food is being made', color: '#FF2B2B' },
    { icon: MaterialCommunityIcons, iconName: 'bike', label: 'On the Way', desc: 'Courier is heading to you', color: '#171717' },
    { icon: MaterialCommunityIcons, iconName: 'package', label: 'Delivered', desc: 'Enjoy your meal!', color: '#10B981' },
  ];

  // Auto-advance stages
  useEffect(() => {
    if (stage >= 3) {
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    const timer = setTimeout(() => {
      const next = stage + 1;
      setStage(next);
      updateOrderStage(order.id, next);
    }, stage === 0 ? 3000 : stage === 1 ? 5000 : 7000);
    return () => clearTimeout(timer);
  }, [stage, order.id, updateOrderStage]);

  // Animate courier progress
  useEffect(() => {
    if (stage < 2) {
      setCourierProgress(0);
      return;
    }
    if (stage >= 3) {
      setCourierProgress(100);
      return;
    }
    const interval = setInterval(() => {
      setCourierProgress((p) => Math.min(p + 2, 95));
    }, 150);
    return () => clearInterval(interval);
  }, [stage]);

  const eta = stage >= 3 ? 'Delivered' : stage === 2 ? `${Math.max(2, 15 - Math.floor(courierProgress / 10))} min` : '25-35 min';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with status */}
      <View style={styles.header}>
        {/* Status circle */}
        <View style={[styles.statusCircle, { backgroundColor: stage >= 3 ? '#10B981' : stage >= 2 ? '#F59E0B' : stage >= 1 ? '#FF2B2B' : '#6B7280' }]}>
          {stages[stage].icon ? <stages[stage].icon name={stages[stage].iconName} size={32} color={stages[stage].color} /> : null}
        </View>
        <Text style={styles.statusLabel}>{stageLabels[stage]}</Text>

        <Text style={styles.eta}>Estimated: {eta}</Text>
      </View>

      {/* Map area */}
      <View style={styles.mapArea}>
        {/* Route line */}
        <View style={styles.routeLine} />

        {/* Restaurant marker */}
        <View style={styles.marker}>
          <MaterialCommunityIcons name="chef-hat" size={24} color="#FF2B2B" />
          <Text style={styles.markerText}>Restaurant</Text>
        </View>

        {/* Destination marker */}
        <View style={styles.marker}>
          <MaterialCommunityIcons name="map-marker" size={24} color="#171717" />
          <Text style={styles.markerText}>You</Text>
        </View>

        {/* Animated courier */}
        {stage >= 2 && stage < 3 && (
          <View style={styles.courier}>
            <MaterialCommunityIcons name="bike" size={20} color="#FF2B2B" />
          </View>
        )}

        {/* ETA overlay */}
        <View style={styles.etaOverlay}>
          <Text style={styles.etaText}>Estimated Arrival</Text>
          <Text style={styles.etaValue}>{eta}</Text>
        </View>
      </View>

      {/* Progress tracker */}
      <View style={styles.progressTracker}>
        <View style={styles.progressLabel}>Order Progress</View>
        <View style={styles.progressBarBackground}>
          <View style={[
            styles.progressBarFill,
            { width: `${(stage / 3) * 100}%` },
          ]} />
        </View>
        <Text style={styles.progressPercentage}>{Math.round((stage / 3) * 100)}%</Text>

        <View style={styles.progressSteps}>
          {stages.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx <= stage;
            const isCurrent = idx === stage;
            return (
              <View key={idx} style={[
                styles.progressStep,
                { backgroundColor: isActive ? (isCurrent ? '#FF2B2B' : '#171717') : '#E5E7EB' },
              ]}>
                {Icon ? <Icon name={s.iconName} size={20} color={isActive ? s.color : '#6B7280'} /> : null}
                <Text style={styles.stepLabel}>{s.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Order details */}
      <View style={styles.orderDetails}>
        <Text style={styles.detailsTitle}>Order Details</Text>
        <View style={styles.detailsGrid}>
          {order.items.map((item, idx) => (
            <View key={item.id} style={styles.detailItem}>
              <Text style={styles.detailName}>{item.name}</Text>
              <Text style={styles.detailQuantity}>{item.quantity}x</Text>
              <Text style={styles.detailPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.divider} />
        <View style={styles.detailsGrid}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Delivery address */}
      <View style={styles.deliveryAddress}>
        <Text style={styles.addressTitle}>Delivery Address</Text>
        <View style={styles.addressItems}>
          <Text style={styles.addressLabel}>{order.address.label}</Text>
          <Text style={styles.addressStreet}>{order.address.street}</Text>
          <Text style={styles.addressCity}>{order.address.city} {order.address.zip}</Text>
          {order.address.instructions && (
            <Text style={styles.addressInstructions}>Note: {order.address.instructions}</Text>
          )}
        </View>
      </View>

      {/* Action button */}
      {stage < 3 && (
        <TouchableOpacity style={styles.continueButton} onPress={() => navigateToScreen('home')}>
          <Text style={styles.continueText}>Continue Ordering</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const stageLabels = ['Placed', 'Preparing', 'On the Way', 'Delivered'];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  statusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusLabel: { fontSize: 16, fontWeight: '700', color: '#171717' },
  eta: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  mapArea: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 20 },
  routeLine: { height: 4, backgroundColor: '#E5E7EB' },
  marker: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 8 },
  markerText: { fontSize: 12, color: '#6B7280' },
  courier: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -16 }],
    width: 32,
    height: 32,
    backgroundColor: '#FF2B2B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaOverlay: { padding: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  etaText: { fontSize: 12, color: 'white' },
  etaValue: { fontSize: 14, fontWeight: '700', color: 'white' },
  progressTracker: { padding: 20 },
  progressLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#FF2B2B', borderRadius: 4 },
  progressPercentage: { fontSize: 12, color: '#6B7280', marginTop: 4, alignSelf: 'center' },
  progressSteps: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  progressStep: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  orderDetails: { padding: 20, backgroundColor: 'white', marginTop: 20 },
  detailsTitle: { fontSize: 18, fontWeight: '700', color: '#171717', marginBottom: 12 },
  detailsGrid: { gap: 16, marginBottom: 12 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between' },
  detailName: { fontSize: 14, color: '#171717' },
  detailQuantity: { fontSize: 12, color: '#6B7280' },
  detailPrice: { fontSize: 14, fontWeight: '700', color: '#171717' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  detailsGrid2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 16, fontWeight: '700', color: '#171717' },
  deliveryAddress: { padding: 20, backgroundColor: 'white', marginTop: 20 },
  addressTitle: { fontSize: 16, fontWeight: '700', color: '#171717', marginBottom: 8 },
  addressItems: { gap: 4 },
  addressLabel: { fontSize: 14, color: '#171717' },
  addressStreet: { fontSize: 13, color: '#6B7280' },
  addressCity: { fontSize: 13, color: '#6B7280' },
  addressInstructions: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  continueButton: { backgroundColor: '#FF2B2B', padding: 16, borderRadius: 12, alignItems: 'center', margin: 20 },
  continueText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

export default OrderTracking;
