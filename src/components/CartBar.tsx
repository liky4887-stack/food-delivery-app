import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';

interface CartBarProps {
  restaurantId: string;
}

export function CartBar({ restaurantId }: CartBarProps) {
  const { items, subtotal } = useCart();
  const { navigateToScreen } = useNavigation();

  const cartItemsForRestaurant = items.filter(item => item.restaurantId === restaurantId);
  const count = cartItemsForRestaurant.reduce((sum, item) => sum + item.quantity, 0);
  const restaurantSubtotal = cartItemsForRestaurant.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (count === 0) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigateToScreen('cart')}
      >
        <View style={styles.cartContent}>
          <View style={styles.cartIconContainer}>
            <Ionicons name="cart" size={24} color="white" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Text style={styles.totalText}>${restaurantSubtotal.toFixed(2)}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 72,
    left: 16,
    right: 16,
    zIndex: 20,
    elevation: 8,
  },
  cartButton: {
    backgroundColor: '#FF2B2B',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cartIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
  },
  viewCartText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  totalText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartBar;
