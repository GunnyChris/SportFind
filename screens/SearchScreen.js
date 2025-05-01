import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Icon Button Placeholder
const SelectPlaceholder = ({ label, icon }) => (
  <TouchableOpacity style={styles.selectPlaceholder}>
    <View style={styles.iconText}>
      <Ionicons name={icon} size={20} color="#666" style={{ marginRight: 10 }} />
      <Text style={styles.selectPlaceholderText}>{label}</Text>
    </View>
    <Ionicons name="chevron-down" size={20} color="#666" />
  </TouchableOpacity>
);

// Community card with actual image
const CommunityCard = ({ title, image }) => (
  <TouchableOpacity style={styles.communityCard}>
    <Image source={{ uri: image }} style={styles.communityImagePlaceholder} resizeMode="cover" />
    <Text style={styles.communityCardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingSearches = ['Badminton', 'Swimming', 'Volleyball', 'Futsal', 'Football'];

  const featuredCentres = [
    {
      id: '1',
      title: 'Nike Futsal',
      image:
        'https://images.pexels.com/photos/27348423/pexels-photo-27348423/free-photo-of-tengara-penunjuk-penanda-tonggak-batas.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '2',
      title: 'Adidas Arena',
      image: 'https://www.iq-mag.net/wp-content/uploads/2024/02/GF47XthX0AANyX4.jpeg',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search and Filter</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Trending */}
        <Text style={styles.sectionTitle}>Trending Searches</Text>
        <View style={styles.trendingContainer}>
          {trendingSearches.map((item, index) => (
            <TouchableOpacity key={index} style={styles.trendingChip}>
              <Text style={styles.trendingChipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search by Category */}
        <Text style={styles.sectionTitle}>Search by Category</Text>
        <View style={styles.filterContainer}>
          <SelectPlaceholder label="Location" icon="location-outline" />
          <SelectPlaceholder label="Sports Type" icon="football-outline" />
          <SelectPlaceholder label="Indoor/Outdoor" icon="home-outline" />
          <SelectPlaceholder label="Free/Paid" icon="card-outline" />
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Centres */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Community Centres</Text>
          <TouchableOpacity onPress={() => console.log('See More Centres')}>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredCentres}
          renderItem={({ item }) => <CommunityCard title={item.title} image={item.image} />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={{ paddingLeft: 15 }}
        />
      </ScrollView>
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
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  searchInput: {
    height: 45,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  trendingChip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  trendingChipText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  selectPlaceholder: {
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectPlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  applyButton: {
    height: 45,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  seeMore: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  horizontalScroll: {},
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 15,
    width: 180,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 10,
  },
  communityImagePlaceholder: {
    height: 100,
    width: '100%',
    backgroundColor: '#E0E0E0',
  },
  communityCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
  },
});
