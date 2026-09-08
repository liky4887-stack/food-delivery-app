import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';

export function ProfileScreen() {
  const { navigateToScreen } = useNavigation();
  const { favorites, savedPromoCodes, addresses, orderHistory, selectedAddress, dietaryPrefs } = useUser();

  const handleReorder = () => {
    // Would need order history to reorder
    navigateToScreen('home');
  };

  const toggleDietaryPref = (pref: string) => {
    // Toggle dietary preference
  };

  const handleDeleteAddress = (id: string) => {
    // Delete address
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (orderHistory.length === 0) {
    // Simplified - would need order history
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>Profile</Text>
      </View>

      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.settingRow} onPress={() => navigateToScreen('orders')}>
          <View style={styles.settingIcon}>
            <Ionicons name="receipt" size={24} color="#171717" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Order History</Text>
            <Text style={styles.settingSubtitle}>See past and active orders</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={() => navigateToScreen('orders')}>
          <View style={styles.settingIcon}>
            <Ionicons name="heart" size={24} color="#171717" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Favorites</Text>
            <Text style={styles.settingSubtitle}>
              {favorites.length} saved restaurants
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={() => navigateToScreen('orders')}>
          <View style={styles.settingIcon}>
            <Ionicons name="bookmark" size={24} color="#171717" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Saved Addresses</Text>
            <Text style={styles.settingSubtitle}>
              {addresses?.length || 1} saved
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={() => navigateToScreen('orders')}>
          <View style={styles.settingIcon}>
            <Ionicons name="pricetag" size={24} color="#171717" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Promo Codes</Text>
            <Text style={styles.settingSubtitle}>
              {savedPromoCodes?.length || 3} available
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={() => navigateToScreen('orders')}>
          <View style={styles.settingIcon}>
            <Ionicons name="settings" size={24} color="#171717" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Settings</Text>
            <Text style={styles.settingSubtitle}>Notifications, preferences</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {dietaryPrefs?.length && (
        <View style={styles.dietarySection}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          {dietaryPrefs.map((pref, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.dietaryTag}
            >
              <Text style={styles.dietaryTagText}>
                {pref === 'vegetarian' ? 'Vegetarian' : pref === 'vegan' ? 'Vegan' : pref === 'gluten-free' ? 'Gluten-free' : 'No Nuts'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, backgroundColor: '#F5F5F5' },
  profileHeader: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  profileTitle: { fontSize: 24, fontWeight: '700', color: '#171717' },
  settingsSection: { paddingHorizontal: 20, paddingBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderRadius: 16, marginBottom: 8 },
  settingIcon: { width: 24, height: 24 },
  settingText: { flex: 1, marginHorizontal: 12 },
  settingTitle: { fontSize: 15, fontWeight: '600', color: '#171717' },
  settingSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  dietarySection: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#171717', marginBottom: 12 },
  dietaryTag: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  dietaryTagText: { fontSize: 14, color: '#171717' },
});

export default ProfileScreen;
