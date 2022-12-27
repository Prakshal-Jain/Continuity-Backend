import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from "./Profile";
import Help from "./Help";
import {
  useColorScheme,
} from "react-native";
import PrivacyPolicy from './PrivacyPolicy';
import Settings from './Settings';
import UltraSearch from './UltraSearch';
import UltraSearchResult from './UltraSearchResult';
import React, { useState, useEffect } from 'react';
import Homepage from './Homepage';

const Stack = createNativeStackNavigator();

export default function () {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          initialParams={{
            colorScheme
          }}
          name="Homepage"
          component={Homepage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Profile" component={Profile}
          options={{
            headerStyle: {
              backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            },
            headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="Help" component={Help}
          options={{
            headerStyle: {
              backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            },
            headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="Privacy Policy" component={PrivacyPolicy}
          options={{
            headerStyle: {
              backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            },
            headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen name="Settings" component={Settings}
          options={{
            headerStyle: {
              backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            },
            headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen name="Ultra Search" component={UltraSearch}
          options={{
            headerStyle: {
              backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            },
            headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen name="Ultra Search Results" component={UltraSearchResult}
          options={{
            headerStyle: {
              backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            },
            headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}