import React, { useState, useEffect } from 'react';
import DeviceManager from './DeviceManager';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    StatusBar,
    useColorScheme,
    Image,
    TouchableOpacity,
} from "react-native";
import Login from './Login';
import { io } from "socket.io-client";
import ScaleTouchableOpacity from './components/ScaleTouchableOpacity';
// import EncryptedStorage from 'react-native-encrypted-storage';

export default function App({ navigation }) {

    const [devices, setDevices] = useState([]);
    const [currDeviceName, setCurrentDeviceName] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [credentials, setCredentials] = useState(null);

    // const socket = io("http://161.35.127.215");
    const socket = io("http://10.4.3.41");
    const colorScheme = useColorScheme();

    useEffect(() => {
        socket.on('login', (data) => {
            if (!data.sucessful) {
                console.log("Unsuccessful Login");
                setCredentials(null);
                return;
            }
            else {
                setCredentials(data?.message);
                setIsLoggedIn(true);
            }
        });

        socket.on('all_devices', (data) => {
            setDevices(data);
        });

        socket.on('add_device', (data) => {
            setDevices([
                ...devices,
                data
            ])
        });

    });

    const postCredentials = (creds) => {
        console.log(creds);
        socket.emit("login", creds);
    }


    const styles = StyleSheet.create({
        root: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
        },

        devices_container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 15,
            justifyContent: 'center',
            paddingBottom: 50,
        },

        device_box: {
            width: 150,
            height: 150,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            margin: 15,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        },

        icon_style: {
            alignItems: 'center',
            marginBottom: 10,
        },

        your_devices: {
            fontSize: 30,
            marginBottom: 10,
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'
        },

        footer_options: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: "space-between",
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderTopWidth: 0.5,
            borderTopColor: '#a9a9a9',
        },
    });


    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            {isLoggedIn ?
                (
                    currDeviceName === null ? (
                        [
                            <View style={{ borderBottomColor: '#a9a9a9', borderBottomWidth: 1, width: '100%', alignItems: 'center' }} key="page_label"><Text style={styles.your_devices}>Your Devices</Text></View>,
                            <ScrollView key="device_list" style={{ width: '100%' }} contentContainerStyle={styles.devices_container}>
                                {
                                    devices.map(((x, i) => (
                                        <ScaleTouchableOpacity key={x.device_name} style={styles.device_box} onPress={() => setCurrentDeviceName(x.device_name)} key={`device_${i}`}>
                                            <View style={styles.icon_style}>
                                                <FontAwesome name={x.device_type} size={50} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                            </View>

                                            <View>
                                                <Text style={{ textAlign: 'center', color: colorScheme === 'dark' ? '#fff' : '#000' }}>
                                                    {x.device_name}
                                                </Text>
                                                {x.device_name === credentials.device_name && (
                                                    <Text style={{ textAlign: 'center', color: '#1B8E2D', marginTop: 5, }}>
                                                        <FontAwesome name={'circle'} color="#1B8E2D" /> This Device
                                                    </Text>
                                                )}
                                            </View>
                                        </ScaleTouchableOpacity>
                                    )))
                                }
                            </ScrollView>,
                            (credentials !== null && credentials !== undefined) ? (
                                <View style={styles.footer_options}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Help')}>
                                        <MaterialIcons name="help-outline" size={32} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { credentials })}>
                                        <Image source={{ uri: credentials?.picture }} style={{ width: 32, height: 32, borderRadius: (32 / 2) }} />
                                    </TouchableOpacity>
                                </View>
                            )
                                :
                                null
                        ]
                    )
                        :
                        <DeviceManager setCurrentDeviceName={setCurrentDeviceName} tabs_data={(devices.filter(device => device.device_name === currDeviceName))[0]} credentials={credentials} socket={socket} colorScheme={colorScheme} />
                )
                :
                <Login postCredentials={postCredentials} colorScheme={colorScheme} />
            }
        </SafeAreaView>
    );
}