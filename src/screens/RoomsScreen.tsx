import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'; // Doğru import
import {Room} from '../types';
import {styles} from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Rooms'>;

const RoomsScreen: React.FC<Props> = ({navigation}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const roomsRef = database().ref('rooms');

    const onValueChange = roomsRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const roomsList = Object.entries(data).map(
          ([id, room]: [string, any]) => ({
            id,
            ...room,
          }),
        );
        setRooms(roomsList);
      } else {
        setRooms([]);
      }
    });

    // Cleanup subscription
    return () => roomsRef.off('value', onValueChange);
  }, []);

  const createRoom = async () => {
    if (newRoomName.trim()) {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const newRoom = {
          name: newRoomName.trim(),
          createdBy: currentUser.uid,
          createdAt: database.ServerValue.TIMESTAMP,
        };

        try {
          await database().ref('rooms').push(newRoom);
          setModalVisible(false);
          setNewRoomName('');
        } catch (error: any) {
          console.error('Error creating room:', error);
          Alert.alert('Error', 'Failed to create room');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.roomItem}
            onPress={() =>
              navigation.navigate('Chat', {
                roomId: item.id,
                roomName: item.name,
              })
            }>
            <Text style={styles.roomName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No rooms available</Text>}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>Create Room</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Room Name"
              value={newRoomName}
              onChangeText={setNewRoomName}
            />
            <TouchableOpacity style={styles.button} onPress={createRoom}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RoomsScreen;
