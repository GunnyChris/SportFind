import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder for Icon components
const IconPlaceholder = ({ name, size = 18, color = '#FFC107', style }) => (
  <View style={[{ width: size, height: size, backgroundColor: '#ddd', borderRadius: size / 2 }, style]} />
);

// Placeholder for Avatar
const AvatarPlaceholder = ({ size = 40 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#E0E0E0', marginRight: 10 }} />
);

// Star Rating Component (Simplified)
const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <IconPlaceholder
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={size}
        color={i <= rating ? '#FFC107' : '#E0E0E0'}
        style={{ marginRight: 2 }}
      />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

const ReviewItem = ({ item }) => (
  <View style={styles.reviewItemContainer}>
    <AvatarPlaceholder />
    <View style={styles.reviewContent}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{item.author}</Text>
        <Text style={styles.reviewTimestamp}>{item.timestamp}</Text>
      </View>
      <StarRating rating={item.rating} />
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
    {/* Optional: More options button */}
    {/* <TouchableOpacity style={styles.moreOptionsButton}>...</TouchableOpacity> */}
  </View>
);

export default function ReviewsScreen({ navigation, route }) {
  // const { venueId } = route.params; // Get venue ID if passed

  // Dummy data
  const venueName = 'FX Sudirman Basketball Court';
  const overallRating = 4.0;
  const totalReviews = 52;
  const reviews = [
    { id: '1', author: 'Courtney Henry', rating: 5, text: 'Great court, clean facilities, friendly staff. Highly recommended!', timestamp: '2 min ago' },
    { id: '2', author: 'Cameron Williamson', rating: 4, text: 'Good place to play basketball. Can get a bit crowded during peak hours.', timestamp: '1 hour ago' },
    { id: '3', author: 'Jane Cooper', rating: 3, text: 'Decent court, but the booking system was a bit confusing.', timestamp: '5 hours ago' },
    { id: '4', author: 'John Doe', rating: 4, text: 'Enjoyed playing here. Will come back again.', timestamp: '1 day ago' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Header - Assuming handled by navigator */}
      {/* <View style={styles.header}><Text style={styles.headerTitle}>Reviews</Text></View> */}
      
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.venueName}>{venueName}</Text>
            <Text style={styles.overallRating}>{overallRating.toFixed(1)}</Text>
            <StarRating rating={overallRating} size={24} />
            <Text style={styles.totalReviews}>{totalReviews} Reviews</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Write Review Button */} 
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.writeReviewButton} onPress={() => console.log('Write Review pressed')}> 
          <Text style={styles.writeReviewButtonText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 80, // Space for the button
  },
  listHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
    backgroundColor: '#F8F8F8', // Light background for header section
  },
  venueName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  overallRating: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  reviewItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#FFFFFF', // Match background or add shadow
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  writeReviewButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  writeReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
