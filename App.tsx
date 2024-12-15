import React from 'react';
import './src/config/firebase';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/navigation/types';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Rooms"
          component={RoomsScreen}
          options={{
            headerLeft: () => null,
            title: 'Chat Rooms',
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({route}) => ({
            title: route.params.roomName,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
