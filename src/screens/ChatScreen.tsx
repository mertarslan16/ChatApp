import React, {useState, useEffect} from 'react';
import {View, FlatList, TextInput, TouchableOpacity, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import auth from '@react-native-firebase/auth'; // Import'u güncelliyoruz
import database from '@react-native-firebase/database'; // Import'u güncelliyoruz
import {Message} from '../types';
import {styles} from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<Props> = ({route}) => {
  const {roomId} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Database referansını oluştur
    const messagesRef = database().ref(`messages/${roomId}`);

    // Mesajları dinle
    const onValueChange = messagesRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(
          ([id, message]: [string, any]) => ({
            id,
            ...message,
          }),
        );
        setMessages(messagesList.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setMessages([]); // Eğer mesaj yoksa boş array set et
      }
    });

    // Cleanup subscription
    return () => messagesRef.off('value', onValueChange);
  }, [roomId]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const message = {
          text: newMessage.trim(),
          userId: currentUser.uid,
          userEmail: currentUser.email,
          createdAt: database.ServerValue.TIMESTAMP, // ServerValue kullanıyoruz
        };

        try {
          await database().ref(`messages/${roomId}`).push(message);
          setNewMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }
  };

  const isOwnMessage = (userId: string) => {
    return userId === auth().currentUser?.uid;
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              isOwnMessage(item.userId)
                ? styles.ownMessage
                : styles.otherMessage,
            ]}>
            <Text style={styles.messageEmail}>{item.userEmail}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500} // Maksimum mesaj uzunluğu
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
