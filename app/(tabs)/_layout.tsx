import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Utility function to determine icon color based on color scheme
function getIconColor(colorScheme: 'light' | 'dark' | null): string {
  return colorScheme === 'dark' ? 'white' : 'black';
}

// TabBarIcon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const iconColor = getIconColor(colorScheme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'signin',
          tabBarIcon: ({ color }) => <FontAwesome6 name="arrow-right-from-bracket" size={24} color= {iconColor} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'signup',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-plus" size={24} color={iconColor} />,
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: 'camera',
          tabBarIcon: ({ color }) => (
            <AntDesign name="camera" size={24} color={iconColor} />
          ),
        }}
      />

      <Tabs.Screen
        name="games"
        options={{
          title: 'games',
          tabBarIcon: ({ color }) => (
            <Entypo name="game-controller" size={24} color={iconColor} />
          ),
        }}
      />
    </Tabs>
  );
}
