import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder for Icon components
const IconPlaceholder = ({ name, size = 18, color = '#555', style }) => (
  <View style={[{ width: size, height: size, backgroundColor: '#ddd', borderRadius: size / 2, marginRight: 8 }, style]} />
);

export default function EventDetailsScreen({ navigation, route }) {
  // const { eventId } = route.params; // Get event ID if passed via navigation

  // Dummy data - replace with actual data fetched based on eventId
  const eventDetails = {
    title: 'BCA Marathon Run',
    subtitle: 'CITRALAND MARATHON READY!',
    image: null, // Placeholder
    location: 'Citraland, Surabaya',
    dateTime: 'Sunday, 15 March 2025 | 06:00 AM - 10:00 AM',
    description: 'Every year, BCA hold an event called BCA marathon. Join us for a fun run, snacks and surprises!\n\nEvent Details:\n- Run Categories: 5K, 10K, Half Marathon\n- Refreshments provided\n- Finisher medals for all participants\n- Exciting lucky draw prizes\n\nThis event is suitable for all runners, from beginners to experienced athletes. Come and join the fun!',
    membershipOffers: 'More benefits of joining membership:\n- Get 10% discount for event registration\n- Early bird registration access\n- Exclusive merchandise',
    price: 'Rp 40,000',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        {/* Image Header */}
        <View style={styles.imagePlaceholder}>
          {/* Optional: Overlay text on image */}
          {/* <Text style={styles.imageSubtitle}>{eventDetails.subtitle}</Text> */}
        </View>

        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title}>{eventDetails.title}</Text>

          {/* Location and Date/Time */}
          <View style={styles.detailRow}>
            <IconPlaceholder name="location-outline" />
            <Text style={styles.detailText}>{eventDetails.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <IconPlaceholder name="calendar-outline" />
            <Text style={styles.detailText}>{eventDetails.dateTime}</Text>
          </View>

          {/* Event Details */}
          <Text style={styles.sectionTitle}>Event Details</Text>
          <Text style={styles.description}>{eventDetails.description}</Text>

          {/* Membership Offers */}
          <Text style={styles.sectionTitle}>Membership Offers</Text>
          <View style={styles.offerBox}>
            <Text style={styles.offerText}>{eventDetails.membershipOffers}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Registration Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Registration Fee</Text>
          <Text style={styles.priceText}>{eventDetails.price}</Text>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={() => console.log('Register for event pressed')}> 
          <Text style={styles.registerButtonText}>Register</Text>
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
  container: {
    flex: 1,
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: '#E0E0E0',
    justifyContent: 'flex-end', // Align subtitle to bottom if needed
    padding: 15,
  },
  imageSubtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 5, // Space after icon
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20, // Increased top margin
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  offerBox: {
    backgroundColor: '#1A253A', // Dark blue background
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  offerText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A253A',
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

