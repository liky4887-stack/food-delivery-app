import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../context/NavigationContext';
import { useUser, Address } from '../context/UserContext';

export function AddressPicker() {
  const { state, setShowAddressPicker } = useNavigation();
  const { addresses, selectedAddressId, selectAddress, addAddress, removeAddress } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [instructions, setInstructions] = useState('');

  if (!state.showAddressPicker) return null;

  const handleAdd = () => {
    if (!label.trim() || !street.trim() || !city.trim()) return;
    addAddress({ label, street, city, zip, instructions });
    setLabel('');
    setStreet('');
    setCity('');
    setZip('');
    setInstructions('');
    setShowAddForm(false);
  };

  const getIcon = (addr: Address) => {
    if (addr.label === 'Home') return 'home';
    if (addr.label === 'Work') return 'briefcase';
    return 'map-marker';
  };

  return (
    <View style={styles.overlay} onStartShouldSetResponder={() => true}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={() => setShowAddressPicker(false)}
      />
      <View style={styles.bottomSheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Delivery Address</Text>
          <TouchableOpacity onPress={() => setShowAddressPicker(false)} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          {addresses.map((addr) => {
            const Icon = getIcon(addr);
            const isSelected = addr.id === selectedAddressId;
            return (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, isSelected ? styles.addressCardSelected : styles.addressCardDefault]}
                onPress={() => {
                  selectAddress(addr.id);
                  setShowAddressPicker(false);
                }}
              >
                <View style={[styles.iconContainer, isSelected ? styles.iconContainerSelected : styles.iconContainerDefault]}>
                  {Icon === 'home' ? (
                    <MaterialCommunityIcons name="home" size={20} color={isSelected ? 'white' : '#6B7280'} />
                  ) : Icon === 'briefcase' ? (
                    <MaterialCommunityIcons name="briefcase" size={20} color={isSelected ? 'white' : '#6B7280'} />
                  ) : (
                    <Ionicons name="map" size={20} color={isSelected ? 'white' : '#6B7280'} />
                  )}
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressLabel}>{addr.label}</Text>
                  <Text style={styles.addressStreet}>{addr.street}</Text>
                  <Text style={styles.addressCity}>{addr.city} {addr.zip}</Text>
                  {addr.instructions && (
                    <Text style={styles.addressInstructions}>Note: {addr.instructions}</Text>
                  )}
                </View>
                <View style={styles.addressActions}>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color="#FF2B2B" />
                  )}
                  {addresses.length > 1 && !isSelected && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removeAddress(addr.id);
                      }}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={20} color="#D1D5DB" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {showAddForm ? (
            <View style={styles.formContainer}>
              <TextInput
                placeholder="Label (Home, Work, etc.)"
                value={label}
                onChangeText={setLabel}
                style={styles.input}
              />
              <TextInput
                placeholder="Street address"
                value={street}
                onChangeText={setStreet}
                style={styles.input}
              />
              <View style={styles.cityZipRow}>
                <TextInput
                  placeholder="City, State"
                  value={city}
                  onChangeText={setCity}
                  style={[styles.input, { flex: 1 }]}
                />
                <TextInput
                  placeholder="ZIP"
                  value={zip}
                  onChangeText={setZip}
                  style={[styles.input, { width: 80 }]}
                />
              </View>
              <TextInput
                placeholder="Delivery instructions (optional)"
                value={instructions}
                onChangeText={setInstructions}
                style={styles.input}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, (!label.trim() || !street.trim()) && styles.saveButtonDisabled]}
                  onPress={handleAdd}
                  disabled={!label.trim() || !street.trim()}
                >
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(true)}
            >
              <Ionicons name="add" size={24} color="#FF2B2B" />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
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
    zIndex: 50,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 10,
  },
  addressCardSelected: {
    borderColor: '#FF2B2B',
    backgroundColor: '#FEF2F2',
  },
  addressCardDefault: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconContainerSelected: {
    backgroundColor: '#FF2B2B',
  },
  iconContainerDefault: {
    backgroundColor: '#E5E7EB',
  },
  addressInfo: {
    flex: 1,
    minWidth: 0,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
  },
  addressStreet: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  addressCity: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  addressInstructions: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 4,
  },
  addressActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  formContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cityZipRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF2B2B',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF2B2B',
  },
});

export default AddressPicker;
