import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MusicScreen from '../screens/MusicScreen';
import VideoScreen from '../screens/VideoScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlayerScreen from '../screens/PlayerScreen';
import MusicPlayerScreen from '../screens/MusicPlayerScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import { AuthContext } from '../context/AuthContext';
import { PlayerProvider } from '../context/PlayerContext';
import MiniPlayer from '../components/MiniPlayer';
import { ActivityIndicator, View } from 'react-native';
import { colors, spacing } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: spacing.tabBarHeight,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: colors.background.secondary,
            borderTopWidth: 1,
            borderTopColor: colors.ui.border,
            position: 'absolute',
            bottom: 0,
          },
          tabBarActiveTintColor: colors.primary.main,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Music" 
          component={MusicScreen}
          options={{
            tabBarLabel: 'Música',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="musical-notes" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Video" 
          component={VideoScreen}
          options={{
            tabBarLabel: 'Vídeo',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="play-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Biblioteca',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="library" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <MiniPlayer />
    </>
  );
}

export default function AppNavigator() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <PlayerProvider>
      <Stack.Navigator>
        { !token ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
                    <Stack.Screen 
                      name="Register" 
                      component={RegisterScreen}
                      options={{ 
                        headerShown: true,
                        title: 'Criar Conta',
                        headerStyle: { 
                          backgroundColor: colors.background.primary,
                        },
                        headerTintColor: colors.text.primary,
                        headerTitleStyle: { 
                          fontWeight: 'bold',
                          fontSize: 18,
                        },
                      }}
                    />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Player" 
              component={PlayerScreen}
              options={{ 
                headerShown: true,
                title: 'Reproduzindo',
                headerStyle: { 
                  backgroundColor: colors.background.primary,
                },
                headerTintColor: colors.text.primary,
                headerTitleStyle: { 
                  fontWeight: 'bold',
                  fontSize: 18,
                },
              }}
            />
            <Stack.Screen 
              name="MusicPlayer" 
              component={MusicPlayerScreen}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="VideoPlayer" 
              component={VideoPlayerScreen}
              options={{ 
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </PlayerProvider>
  );
}
