import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebaseConfig'; // Ensure this path is correct
import { collection, getDocs } from 'firebase/firestore';

// MapComponent remains unchanged
const MapComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        setErrorMsg('Could not fetch location');
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.MapComponent}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.MapComponent}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.MapComponent}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation
    >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="You're here"
      />
    </MapView>
  );
};

// Card component remains unchanged
const Card = ({ title, subtitle, imageSource, style, onPress }) => (
  <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
    {imageSource ? (
      <Image source={{ uri: imageSource }} style={styles.cardImage} />
    ) : (
      <View style={styles.cardImagePlaceholder} />
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);


export default function HomeScreen({ navigation }) {
  const [recommended, setRecommended] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const venuesSnapshot = await getDocs(collection(db, 'venues'));
        const venuesData = venuesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          address: doc.data().address,
          mainImageUrl: doc.data().mainImageUrl || null,
        }));
        setRecommended(venuesData);
      } catch (error) {
        console.error('Error fetching recommended venues:', error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventsData = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          const eventDate = data.startDate?.toDate();
          const formattedDate = eventDate
            ? eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '';
          return {
            id: doc.id,
            title: data.title,
            subtitle: formattedDate,
            imageUrl: data.imageUrl || null,
          };
        });
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchRecommended();
    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SportFind</Text>
        </View>

        <Text style={styles.standaloneTitle}>Sports Centre Near You</Text>
        <MapComponent />

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VenueList')}>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>
        {loadingRecommended ? (
          <ActivityIndicator size="small" color="#0000ff" style={{ marginLeft: 15 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {recommended.map((item) => (
              <Card
                key={item.id}
                title={item.name}
                subtitle={item.address}
                imageSource={item.mainImageUrl}
                style={styles.recommendedCard}
                onPress={() => navigation.navigate('CourtDetails', { venueId: item.id })} // Pass venueId
              />
            ))}
          </ScrollView>
        )}

        {/* Events Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Events You May Like</Text>
          <TouchableOpacity onPress={() => console.log('See More Events')}>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>
        {loadingEvents ? (
          <ActivityIndicator size="small" color="#0000ff" style={{ marginLeft: 15 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {events.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                imageSource={item.imageUrl}
                style={styles.eventCard}
              />
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1A253A',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  standaloneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMore: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  MapComponent: {
    height: 200,
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 15,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  horizontalScroll: {
    paddingLeft: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  recommendedCard: {
    width: Dimensions.get('window').width * 0.6,
  },
  eventCard: {
    width: Dimensions.get('window').width * 0.7,
  },
  cardImagePlaceholder: {
    height: 120,
    width: '100%',
    backgroundColor: '#E0E0E0',
  },
  cardImage: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },  
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
