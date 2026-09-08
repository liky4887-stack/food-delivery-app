import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';
import { promoCodes } from '../context/CartContext';
import { getRestaurantById } from '../data/restaurants';

export function CartScreen() {
  const { items, totalItems, subtotal, discount, removeItem, updateQuantity, applyPromo, clearCart, deliveryType, setDeliveryType } = useCart();
  const { selectedAddress } = useUser();
  const { navigateToScreen } = useNavigation();
  const [promoCode, setPromoCode] = React.useState('');
  const [promoApplied, setPromoApplied] = React.useState(false);

  const handleApplyPromo = () => {
    if (applyPromo(promoCode)) {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Browse restaurants and add items to your cart</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigateToScreen('home')}>
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const handleCheckout = () => {
    // Navigate to orders/confirm
    navigateToScreen('orders');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Shopping Cart</Text>
      <Text style={styles.itemCount}>{totalItems} items</Text>

      <View style={styles.list}>
        {items.map(item => {
          const restaurant = getRestaurantById(item.restaurantId);
          return (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemRestaurant}>{restaurant?.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
                      <Ionicons name="remove" size={16} color="#171717" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
                      <Ionicons name="add" size={16} color="#171717" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={styles.promoSection}>
        <TextInput
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          style={styles.promoInput}
        />
        <TouchableOpacity style={styles.promoButton} onPress={handleApplyPromo}>
          <Text style={styles.promoButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.summaryDiscount}>-${discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$0.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${(subtotal - discount).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: '700', color: '#171717', marginBottom: 4 },
  itemCount: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 },
  emptyIconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#171717', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  browseButton: { backgroundColor: '#FF2B2B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  browseButtonText: { color: 'white', fontSize: 15, fontWeight: '600' },
  list: { gap: 12, marginBottom: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  itemName: { fontSize: 15, fontWeight: '600', color: '#171717' },
  itemRestaurant: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#171717' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 16, fontWeight: '600', color: '#171717' },
  deleteButton: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  promoSection: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  promoInput: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 8, fontSize: 15 },
  promoButton: { backgroundColor: '#FF2B2B', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  promoButtonText: { color: 'white', fontWeight: '600' },
  summary: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#171717', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, color: '#171717', fontWeight: '600' },
  summaryDiscount: { fontSize: 14, color: '#16A34A', fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#171717' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#171717' },
  checkoutButton: { backgroundColor: '#FF2B2R', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 32 },
  checkoutButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});

export default CartScreen;
