import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DietaryTag } from '../data/restaurants';

interface DietaryBadgesProps {
  tags: DietaryTag[];
  size?: 'sm' | 'xs';
}

export function DietaryBadges({ tags, size = 'sm' }: DietaryBadgesProps) {
  if (!tags || tags.length === 0) return null;

  const tagColors: Record<string, { color: string; bg: string; icon: string }> = {
    vegetarian: { color: '#10B981', bg: '#DCFCE7', icon: 'leaf' },
    vegan: { color: '#22C55E', bg: '#DCFCE7', icon: 'sprout' },
    'gluten-free': { color: '#F59E0B', bg: '#FEF3C7', icon: 'wheat' },
    'no-dairy': { color: '#3B82F6', bg: '#BFDBFE', icon: 'milk' },
    'no-nuts': { color: '#EF4444', bg: '#FECACA', icon: 'nut' },
  };

  return (
    <View style={[styles.container, size === 'xs' && styles.xSmall]}>
      {tags.map((tag) => {
        const config = tagColors[tag];
        return config ? (
          <View key={tag} style={[styles.badge, { backgroundColor: config.bg }]}>
            <MaterialCommunityIcons name={config.icon as any} size={size === 'xs' ? 12 : 14} color={config.color} />
            <Text style={[styles.tagText, { color: config.color }, size === 'xs' && styles.tagTextXSmall]}>
              {tag === 'vegetarian' ? 'Veg' : tag === 'vegan' ? 'Vegan' : tag === 'gluten-free' ? 'GF' : tag === 'no-dairy' ? 'No Dairy' : 'No Nuts'}
            </Text>
          </View>
        ) : null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  xSmall: {
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tagTextXSmall: {
    fontSize: 9,
  },
});

export default DietaryBadges;
