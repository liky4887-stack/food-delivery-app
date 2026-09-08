import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRestaurantById, getMenuItemById, CustomizationGroup } from '../data/restaurants';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import DietaryBadges from '../components/DietaryBadges';

export function ProductDetail({ restaurantId, itemId }: { restaurantId: string; itemId: string }) {
  const { closeProduct } = useNavigation();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const restaurant = getRestaurantById(restaurantId);
  const item = getMenuItemById(restaurantId, itemId);

  if (!item || !restaurant) return null;

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizationState, setCustomizationState] = useState<any>({});

  // Initialize customization defaults
  useMemo(() => {
    if (!item?.customizations) return;
    const defaults: any = {};
    item.customizations.forEach((group: any) => {
      if (group.type === 'single' && group.options.length > 0) {
        defaults[group.id] = [group.options[0].id];
      } else {
        defaults[group.id] = [];
      }
    });
    setCustomizationState(defaults);
  }, [item]);

  const toggleOption = (groupId: string, optionId: string) => {
    setCustomizationState((prev: any) => {
      if (groupId in prev) {
        const current = prev[groupId] || [];
        if (current.includes(optionId)) {
          return { ...prev, [groupId]: current.filter((id: string) => id !== optionId) };
        }
        return { ...prev, [groupId]: [...current, optionId] };
      }
      return prev;
    });
  };

  const calculateTotalPrice = () => {
    let total = item.price;
    if (item.customizations) {
      item.customizations.forEach((group: any) => {
        const selected = customizationState[group.id] || [];
        selected.forEach((optId: string) => {
          const option = group.options.find((o: any) => o.id === optId);
          if (option) total += option.price;
        });
      });
    }
    return total * quantity;
  };

  const getSelectedCustomizations = () => {
    const result: any[] = [];
    if (item.customizations) {
      item.customizations.forEach((group: any) => {
        const selected = customizationState[group.id] || [];
        selected.forEach((optId: string) => {
          const option = group.options.find((o: any) => o.id === optId);
          if (option) {
            result.push({
              groupName: group.name,
              optionLabel: option.label,
              optionPrice: option.price,
            });
          }
        });
      });
    }
    return result;
  };

  const handleAddToCart = () => {
    addItem(restaurantId, restaurant.name, item, quantity, getSelectedCustomizations(), specialInstructions);
    showToast(`${quantity}x ${item.name} added to cart`);
    closeProduct();
  };

  const totalPrice = calculateTotalPrice();

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={closeProduct}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* Hero image */}
        <View style={styles.hero}>
          <Image source={{ uri: item.image }} style={styles.heroImage} />
          <TouchableOpacity style={styles.closeButton} onPress={closeProduct} />
        </View>

        {/* Item details */}
        <View style={styles.details}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.priceSection}>
            <Text style={styles.basePrice}>${item.price.toFixed(2)}</Text>

            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <DietaryBadges tags={item.dietaryTags} size="xs" />
            )}
          </View>

          {/* Customizations */}
          {item.customizations?.map((group: CustomizationGroup) => (
            <View key={group.id} style={styles.customizationGroup}>
              <Text style={styles.customizationTitle}>{group.name}</Text>
              {group.options.map((option: any) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.customizationOption,
                    customizationState[group.id]?.includes(option.id) && styles.customizationOptionSelected,
                  ]}
                  onPress={() => toggleOption(group.id, option.id)}
                >
                  <Text style={styles.customizationOptionText}>
                    {option.label} ${option.price > 0 ? `+$${option.price.toFixed(2)}` : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Ionicons name="remove" size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Special instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsLabel}>Special instructions</Text>
            <TextInput
              placeholder="Add special instructions (optional)"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              style={styles.instructionsInput}
            />
          </View>

          {/* Add to cart button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add ${totalPrice.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    position: 'relative',
    height: 200,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    alignItems: 'flex-end',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  details: {
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#171717' },
  description: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  priceSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  basePrice: { fontSize: 18, fontWeight: '700', color: '#171717' },
  dietaryBadges: { marginTop: 4 },
  customizationGroup: { marginBottom: 16 },
  customizationTitle: { fontSize: 14, fontWeight: '600', color: '#171717', marginBottom: 8 },
  customizationOption: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
    minWidth: 100,
  },
  customizationOptionSelected: {
    backgroundColor: '#FF2B2B',
  },
  customizationOptionText: { fontSize: 12, color: '#171717' },
  quantitySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  quantityLabel: { fontSize: 14, color: '#6B7280' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quantityValue: { fontSize: 16, fontWeight: '700', color: '#171717' },
  instructionsSection: { marginBottom: 16 },
  instructionsLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  instructionsInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: { backgroundColor: '#FF2B2B', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

export default ProductDetail;
