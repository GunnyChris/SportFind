import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig'; // Firebase imports
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Placeholder for Icon components (e.g., from expo-vector-icons)
const IconPlaceholder = ({ name, size = 24, color = '#333' }) => (
  <View style={{ width: size, height: size, backgroundColor: '#ddd', borderRadius: size / 2, marginRight: 15 }} />
);

const ProfileInfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

const ActivityItem = ({ title, date, location }) => (
  <TouchableOpacity style={styles.activityCard}>
    <Text style={styles.activityTitle}>{title}</Text>
    <Text style={styles.activityDetails}>{date} - {location}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([
    { id: '1', title: 'BCA Marathon Run', date: '15/03/2025', location: 'Citraland' },
    { id: '2', title: 'Badminton Session', date: '12/03/2025', location: 'ABC Court' },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Convert Firestore Timestamp to JS Date string
            const dob = userData.dob?.toDate ? userData.dob.toDate().toLocaleDateString() : userData.dob;

            setUser({
              name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
              membership: userData.membership || 'Regular Member',
              dob,
              gender: userData.gender || '',
              email: currentUser.email,
              phone: currentUser.phoneNumber || userData.phoneNumber || '',
            });
          } else {
            // If no user doc exists, use minimal auth info
            setUser({
              name: currentUser.displayName || 'User',
              membership: 'Regular Member',
              dob: '',
              gender: '',
              email: currentUser.email,
              phone: currentUser.phoneNumber || '',
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({
            name: 'User',
            membership: 'Regular Member',
            dob: '',
            gender: '',
            email: currentUser.email || '',
            phone: '',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>You are not signed in.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SportFind</Text>
          {/* Add Search Icon if needed */}
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <IconPlaceholder name="person-outline" size={60} color="#fff" />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileMembership}>{user.membership}</Text>
        </View>

        {/* Profile Info Section */}
        <View style={styles.infoSection}>
          <ProfileInfoItem label="Date of Birth" value={user.dob} />
          <ProfileInfoItem label="Gender" value={user.gender} />
          <ProfileInfoItem label="Email" value={user.email} />
          <ProfileInfoItem label="Phone Number" value={user.phone} />
        </View>

        {/* Activities Section */}
        <Text style={styles.sectionTitle}>Activities</Text>
        <View style={styles.activitySection}>
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              date={activity.date}
              location={activity.location}
            />
          ))}
        </View>

        {/* Add some bottom padding */}
        <View style={{ height: 30 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileHeader: {
    backgroundColor: '#1A253A',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileMembership: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  activitySection: {
    marginHorizontal: 15,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.00,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  activityDetails: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});