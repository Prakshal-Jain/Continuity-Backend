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
import { StateContext } from "./state_context";
import { io } from "socket.io-client";
import TermsDisclaimerUltraSearch from "./TermsDisclaimerUltraSearch";
import TrackersContacted from "./TrackersContacted";
import DeviceBrowserHistory from "./DeviceBrowserHistory";
import BrowserWindow from "./BrowserWindow";

const Stack = createNativeStackNavigator();
const socket = io("http://10.3.12.22");

const componentWrapper = ({ navigation, route }) => {

}

export default function () {
  const colorScheme = useColorScheme();
  const [credentials, setCredentials] = useState(null);
  const [currDeviceName, setCurrentDeviceName] = useState(null);
  const [devices, setDevices] = useState([]);

  const headerOptions = {
    headerStyle: {
      backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
    },
    headerTintColor: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }

  return (
    <StateContext.Provider value={{ credentials, setCredentials, currDeviceName, setCurrentDeviceName, devices, setDevices, socket, colorScheme }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Homepage"
            component={Homepage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Profile" component={Profile}
            options={headerOptions}
          />
          <Stack.Screen name="Help" component={Help}
            options={headerOptions}
          />
          <Stack.Screen name="Privacy Policy" component={PrivacyPolicy}
            options={headerOptions}
          />

          <Stack.Screen name="Settings" component={Settings}
            options={headerOptions}
          />

          <Stack.Screen name="Ultra Search" component={UltraSearch}
            options={{ ...headerOptions, presentation: 'modal' }}
          />

          <Stack.Screen name="Ultra Search Results" component={UltraSearchResult}
            options={{ ...headerOptions, presentation: 'modal' }}
          />

          <Stack.Screen name="Ultra Search | Terms of Use and Disclaimer" component={TermsDisclaimerUltraSearch}
            options={headerOptions}
          />

          <Stack.Screen name="Trackers Contacted" component={TrackersContacted}
            options={{ ...headerOptions, presentation: 'modal' }}
          />

          <Stack.Screen name="Search History" component={DeviceBrowserHistory}
            options={headerOptions}
          />

          <Stack.Screen name="Browser" component={BrowserWindow}
            options={headerOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </StateContext.Provider>
  );
}