import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Linking,
} from 'react-native';

const DISCOUNTS = [
  {
    id: '1',
    name: 'UNiDAYS',
    description: 'Free student discounts on fashion, tech, food & more',
    url: 'https://www.myunidays.com',
    category: 'General',
    icon: '🎓',
    iconColor: '#8B5CF6',
  },
  {
    id: '2',
    name: 'Student Beans',
    description: 'Verified student discounts at top brands worldwide',
    url: 'https://www.studentbeans.com',
    category: 'General',
    icon: '🏷️',
    iconColor: '#10B981',
  },
  {
    id: '3',
    name: 'GitHub Education',
    description: 'Free developer tools, credits & learning resources',
    url: 'https://education.github.com/pack',
    category: 'Tech',
    icon: '💻',
    iconColor: '#1F2937',
  },
  {
    id: '4',
    name: 'Spotify Student',
    description: 'Premium music streaming at 50% off for students',
    url: 'https://www.spotify.com/student',
    category: 'Entertainment',
    icon: '🎵',
    iconColor: '#1DB954',
  },
  {
    id: '5',
    name: 'Apple Education',
    description: 'Special pricing on Mac, iPad & accessories',
    url: 'https://www.apple.com/shop/education',
    category: 'Tech',
    icon: '🍎',
    iconColor: '#374151',
  },
  {
    id: '6',
    name: 'Amazon Prime Student',
    description: '6-month free trial + 50% off annual membership',
    url: 'https://www.amazon.com/amazonprime',
    category: 'Shopping',
    icon: '📦',
    iconColor: '#F59E0B',
  },
  {
    id: '7',
    name: 'Adobe Creative Cloud',
    description: '60%+ off all creative apps for students',
    url: 'https://www.adobe.com/creativecloud/plans.html',
    category: 'Tech',
    icon: '🎨',
    iconColor: '#EF4444',
  },
  {
    id: '8',
    name: 'Notion for Education',
    description: 'Free Plus plan for students and educators',
    url: 'https://www.notion.so/product/notion-for-education',
    category: 'Productivity',
    icon: '📝',
    iconColor: '#0F172A',
  },
];

const CATEGORY_COLORS = {
  General: '#8B5CF6',
  Tech: '#3B82F6',
  Entertainment: '#EC4899',
  Shopping: '#F59E0B',
  Productivity: '#10B981',
};

export default function DiscountsScreen() {
  const openSite = (url) => {
    Linking.openURL(url);
  };

  const renderDiscount = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.discountCard, pressed && { opacity: 0.95 }]}
      onPress={() => openSite(item.url)}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.iconColor + '20' }]}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.cardName}>{item.name}</Text>
          <View
            style={[
              styles.catBadge,
              { backgroundColor: (CATEGORY_COLORS[item.category] || '#0A2463') + '20' },
            ]}
          >
            <Text
              style={[
                styles.catBadgeText,
                { color: CATEGORY_COLORS[item.category] || '#0A2463' },
              ]}
            >
              {item.category}
            </Text>
          </View>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Student Discounts</Text>
      </View>

      <View style={styles.promoCard}>
        <Text style={styles.promoIcon}>🎯</Text>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Save More as a Student</Text>
          <Text style={styles.promoText}>
            Browse verified discounts from top brands and services available exclusively for students.
          </Text>
        </View>
      </View>

      <FlatList
        data={DISCOUNTS}
        keyExtractor={(item) => item.id}
        renderItem={renderDiscount}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  promoCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#0A2463',
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  promoIcon: {
    fontSize: 28,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
});