import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // adjust path if needed
import Icon from 'react-native-vector-icons/FontAwesome';

// Placeholder for Icon components
const IconPlaceholder = ({ name, size = 18, color = '#555', style }) => (
  <View
    style={[{ width: size, height: size, backgroundColor: '#ddd', borderRadius: size / 2, justifyContent: 'center', alignItems: 'center' }, style]}
  />
);

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

const VenueCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item.id)}>
    {item.mainImageUrl ? (
      <Image source={{ uri: item.mainImageUrl }} style={styles.image} />
    ) : (
      <View style={styles.imagePlaceholder} />
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <RatingStars rating={item.averageRating ?? 0} />
        <Text style={[styles.ratingText, { marginLeft: 8 }]}>
          {item.averageRating ?? '-'}
        </Text>
      </View>
      <Text style={styles.cardPrice}>Rp {item.minimumRate ?? 'N/A'} / Hour</Text>
    </View>
  </TouchableOpacity>
);

export default function VenueListScreen({ navigation }) {
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'venues'));
      const venueList = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        let minimumRate = null;

        // Optional: get minimum court price
        try {
          const courtsSnapshot = await getDocs(collection(db, `venues/${doc.id}/courts`));
          courtsSnapshot.forEach((courtDoc) => {
            const courtData = courtDoc.data();
            if (courtData.hourlyRate && (minimumRate === null || courtData.hourlyRate < minimumRate)) {
              minimumRate = courtData.hourlyRate;
            }
          });
        } catch (e) {
          console.warn('Error fetching courts:', e);
        }

        venueList.push({
          id: doc.id,
          ...data,
          minimumRate,
        });
      }

      setVenues(venueList);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVenuePress = (venueId) => {
    // Passing venueId to navigate
    navigation.navigate('CourtDetails', { venueId }); // Pass only venueId
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search venues..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#555" />
      ) : (
        <FlatList
          data={filteredVenues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VenueCard item={item} onPress={handleVenuePress} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  listContent: { paddingHorizontal: 16 },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: { width: '100%', height: 160 },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#ddd',
  },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: { marginTop: 6, fontSize: 14, fontWeight: '500', color: '#444' },
});
