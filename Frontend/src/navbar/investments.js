import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Linking,
} from 'react-native';

const VIDEOS = [
  {
    id: '1',
    title: 'Investing for Beginners',
    channel: 'Graham Stephan',
    duration: '18:42',
    category: 'Beginner',
    url: 'https://www.youtube.com/watch?v=gFQNPmLKj1k',
    icon: '📈',
  },
  {
    id: '2',
    title: 'How the Stock Market Works',
    channel: 'The Plain Bagel',
    duration: '12:30',
    category: 'Stocks',
    url: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo',
    icon: '📊',
  },
  {
    id: '3',
    title: 'Index Funds vs ETFs',
    channel: 'Andrei Jikh',
    duration: '15:21',
    category: 'Funds',
    url: 'https://www.youtube.com/watch?v=vsUmP7kVNZo',
    icon: '💰',
  },
  {
    id: '4',
    title: 'Cryptocurrency 101',
    channel: 'Whiteboard Crypto',
    duration: '10:55',
    category: 'Crypto',
    url: 'https://www.youtube.com/watch?v=rYQgy8QDEBI',
    icon: '🔗',
  },
  {
    id: '5',
    title: 'How to Build an Emergency Fund',
    channel: 'Nate O\'Brien',
    duration: '11:03',
    category: 'Savings',
    url: 'https://www.youtube.com/watch?v=fo4REMWuooo',
    icon: '🏦',
  },
  {
    id: '6',
    title: 'Real Estate Investing Basics',
    channel: 'BiggerPockets',
    duration: '22:15',
    category: 'Real Estate',
    url: 'https://www.youtube.com/watch?v=4EMhUJxD7gE',
    icon: '🏠',
  },
];

const CATEGORY_COLORS = {
  Beginner: '#10B981',
  Stocks: '#3B82F6',
  Funds: '#8B5CF6',
  Crypto: '#F59E0B',
  Savings: '#EC4899',
  'Real Estate': '#EF4444',
  Budgeting: '#06B6D4',
};

export default function InvestmentsScreen() {
  const openVideo = (url) => {
    Linking.openURL(url);
  };

  const renderVideo = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.videoCard, pressed && { opacity: 0.95 }]}
      onPress={() => openVideo(item.url)}
    >
      <View
        style={[
          styles.thumbnail,
          { backgroundColor: CATEGORY_COLORS[item.category] || '#0A2463' },
        ]}
      >
        <Text style={styles.playIcon}>▶️</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={styles.channel}>{item.channel}</Text>
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
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Learn to Invest</Text>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Tip of the Day</Text>
          <Text style={styles.tipText}>
            Start investing early. Even small amounts grow significantly with compound interest over time.
          </Text>
        </View>
      </View>

      <FlatList
        data={VIDEOS}
        keyExtractor={(item) => item.id}
        renderItem={renderVideo}
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
  tipCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  videoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  thumbnail: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 32,
  },
  duration: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channel: {
    fontSize: 13,
    color: '#666',
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});