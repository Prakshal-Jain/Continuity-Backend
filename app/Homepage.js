import React, { Component } from 'react';
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
    Image,
    TouchableOpacity,
} from "react-native";
import Login from './Login';
import { io } from "socket.io-client";
import ScaleTouchableOpacity from './components/ScaleTouchableOpacity';
import storage from "./utilities/storage";

const socket = io("http://10.3.12.22");

class Homepage extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        devices: null,
        currDeviceName: null,
        credentials: null
    }

    colorScheme = this.props?.route?.params?.colorScheme;
    navigation = this.props?.navigation;

    componentDidMount = async () => {

        socket.on('auto_authenticate', async (data) => {
            if ((!data?.successful) || this.state.credentials !== null) {
                this.setCredentials(null);
                return
            }
            else {
                console.log(data?.message);
                this.setCredentials(data?.message);
            }
        })

        await this.autoAuthenticate();


        socket.on('login', async (data) => {
            if ((!data?.successful) || this.state.credentials !== null) {
                this.setCredentials(null);
                return;
            }
            else {
                // console.log("Setting Credentials in login ")
                await storage.set("user_id", data?.message?.user_id);
                await storage.set("device_name", data?.message?.device_name);
                await storage.set("device_token", data?.message?.device_token);
                this.setCredentials(data?.message);
            }
        });


        socket.on('all_devices', (data) => {
            if (data?.successful === true) {
                this.setDevices(data?.message);
            }
            else {
                console.log(data?.message);
            }
        });


        socket.on('add_device', (data) => {
            if (data?.successful === true) {
                const all_dev = [
                    ...(this.state.devices),
                    data?.message
                ];
                this.setDevices(all_dev);
            }
            else {
                console.log(data?.message)
            }
        });
    }

    setDevices = (value) => {
        this.setState({ devices: value });
    }

    setCurrentDeviceName = (value) => {
        this.setState({ currDeviceName: value });
    }

    setCredentials = (value) => {
        this.setState({ credentials: value });
    }

    autoAuthenticate = async () => {
        await storage.clearAll();
        const user_id = await storage.get("user_id");
        const device_name = await storage.get("device_name");
        const device_token = await storage.get("device_token");
        // console.log({ user_id, device_name, device_token })
        socket.emit("auto_authenticate", { user_id, device_name, device_token })
    }

    postCredentials = (creds) => {
        creds.user_id = creds?.email;
        socket.emit("login", creds);
    }

    deleteAllData = async () => {
        await storage.clearAll();
        this.setDevices([]);
        this.setCurrentDeviceName(null);
        this.setCredentials(null);
    }

    render() {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: (this.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)' }]}>
                <StatusBar animated={true}
                    barStyle={this.colorScheme == 'dark' ? 'light-content' : 'dark-content'}
                />

                {(this.state.credentials !== null) ?
                    (
                        this.state.currDeviceName === null ? (
                            [
                                <View style={{ borderBottomColor: '#a9a9a9', borderBottomWidth: 1, width: '100%', alignItems: 'center' }} key="page_label"><Text style={[styles.your_devices, { color: this.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }]}>Your Devices</Text></View>,
                                <ScrollView key="device_list" style={{ width: '100%' }} contentContainerStyle={styles.devices_container}>
                                    {
                                        this.state.devices.map(((x, i) => (
                                            <ScaleTouchableOpacity key={x.device_name} style={{ ...styles.device_box, borderColor: this.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }} onPress={() => this.setCurrentDeviceName(x.device_name)} key={`device_${i}`}>
                                                <View style={styles.icon_style}>
                                                    <FontAwesome name={x.device_type} size={50} color={this.colorScheme === 'dark' ? '#fff' : '#000'} />
                                                </View>

                                                <View>
                                                    <Text style={{ textAlign: 'center', color: this.colorScheme === 'dark' ? '#fff' : '#000' }}>
                                                        {x.device_name}
                                                    </Text>
                                                    {x.device_name === this.state.credentials.device_name && (
                                                        <Text style={{ textAlign: 'center', color: '#1B8E2D', marginTop: 5, }}>
                                                            <FontAwesome name={'circle'} color="#1B8E2D" /> This Device
                                                        </Text>
                                                    )}
                                                </View>
                                            </ScaleTouchableOpacity>
                                        )))
                                    }
                                </ScrollView>,
                                (this.state.credentials !== null && this.state.credentials !== undefined) ? (
                                    <View style={styles.footer_options} key="footer">
                                        <TouchableOpacity onPress={() => this.navigation.navigate('Help')}>
                                            <MaterialIcons name="help-outline" size={32} color={this.colorScheme === 'dark' ? '#fff' : '#000'} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.navigation.navigate('Settings', { credentials: this.state.credentials, socket })}>
                                            <MaterialIcons name="settings" size={32} color={this.colorScheme === 'dark' ? '#fff' : '#000'} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.navigation.navigate('Profile', { credentials: this.state.credentials, socket, deleteAllData: this.deleteAllData })}>
                                            <Image source={{ uri: this.state.credentials?.picture }} style={{ width: 32, height: 32, borderRadius: (32 / 2) }} />
                                        </TouchableOpacity>
                                    </View>
                                )
                                    :
                                    null
                            ]
                        )
                            :
                            <DeviceManager setCurrentDeviceName={this.setCurrentDeviceName} tabs_data={(this.state.devices.filter(device => device.device_name === this.state.currDeviceName))[0]} credentials={this.state.credentials} socket={socket} colorScheme={this.colorScheme} navigation={this.navigation} />
                    )
                    :
                    <Login postCredentials={this.postCredentials} colorScheme={this.colorScheme} navigation={this.navigation} />
                }

            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
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
})

export default React.memo(Homepage)