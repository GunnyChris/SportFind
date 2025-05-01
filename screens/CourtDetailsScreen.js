import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Rating stars component
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star if decimal part is 0.5 or more
  const emptyStars = 5 - fullStars - halfStars; // Number of empty stars

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* Full Stars */}
      {Array(fullStars).fill().map((_, i) => (
        <Icon key={i} name="star" size={16} color="#E4A70A" />
      ))}

      {/* Half Stars */}
      {Array(halfStars).fill().map((_, i) => (
        <Icon key={i + fullStars} name="star-half" size={16} color="#E4A70A" />
      ))}

      {/* Empty Stars */}
      {Array(emptyStars).fill().map((_, i) => (
        <Icon key={i + fullStars + halfStars} name="star" size={16} color="#DDDDDD" />
      ))}
    </View>
  );
};

export default function CourtDetailsScreen({ navigation, route }) {
  const { venueId } = route.params; // Retrieve venueId passed from HomeScreen
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const venueRef = doc(db, 'venues', venueId);
        const venueSnap = await getDoc(venueRef);

        if (venueSnap.exists()) {
          const venueData = { id: venueSnap.id, ...venueSnap.data() };

          const courtsSnapshot = await getDocs(collection(db, `venues/${venueId}/courts`));
          let minRate = null;

          courtsSnapshot.forEach((courtDoc) => {
            const courtData = courtDoc.data();
            if (courtData.hourlyRate && (minRate === null || courtData.hourlyRate < minRate)) {
              minRate = courtData.hourlyRate;
            }
          });

          venueData.minimumRate = minRate ?? 'N/A';
          venueData.id = venueId; // Make sure ID is consistent
          setVenue(venueData);
        } else {
          console.log('Venue not found');
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  if (!venue) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        {/* Image Header */}
        <View style={styles.imageContainer}>
          {venue.mainImageUrl ? (
            <Image source={{ uri: venue.mainImageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* Title and Rating */}
          <Text style={styles.title}>{venue.name}</Text>
          <View style={styles.ratingContainer}>
            <RatingStars rating={venue.averageRating ?? 0} />
            <Text style={[styles.ratingText, { marginLeft: 8 }]}>
              {venue.averageRating ?? 0}
            </Text>
            <Text style={styles.reviewsText}>({venue.reviewCount ?? 0} reviews)</Text>
          </View>

          {/* Venue Details */}
          <Text style={styles.sectionTitle}>Venue Details</Text>
          <Text style={styles.description}>{venue.description}</Text>

          {/* Membership Offers */}
          <Text style={styles.sectionTitle}>Membership Offers</Text>
          <View style={styles.offerBox}>
            <Text style={styles.offerText}>{venue.membershipOffers}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceText}>{`Rp ${venue.minimumRate} / hour`}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate('CourtBooking', {
              venueId: venue.id, // Pass venueId correctly
            })
          }
        >
          <Text style={styles.bookButtonText}>Book Court</Text>
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
  imageContainer: {
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: '#E0E0E0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 2,
    marginRight: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  offerBox: {
    backgroundColor: '#1A253A',
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
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});