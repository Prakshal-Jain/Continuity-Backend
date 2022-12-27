import React, { Component } from 'react';
import DeviceManager from './DeviceManager';
import Login from './Login';
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
import ScaleTouchableOpacity from './components/ScaleTouchableOpacity';
import storage from "./utilities/storage";
import { StateContext } from "./state_context";

class Homepage extends Component {
    static contextType = StateContext;
    constructor(props) {
        super(props);
    }

    navigation = this.props?.navigation;

    componentDidMount = async () => {
        this?.context?.socket.on('auto_authenticate', async (data) => {
            if ((!data?.successful) || this?.context?.credentials !== null) {
                this?.context?.setCredentials(null);
                return
            }
            else {
                console.log(data?.message);
                this?.context?.setCredentials(data?.message);
            }
        })

        await this.autoAuthenticate();


        this?.context?.socket.on('login', async (data) => {
            if ((!data?.successful) || this?.context?.credentials !== null) {
                this?.context?.setCredentials(null);
                return;
            }
            else {
                // console.log("Setting Credentials in login ")
                await storage.set("user_id", data?.message?.user_id);
                await storage.set("device_name", data?.message?.device_name);
                await storage.set("device_token", data?.message?.device_token);
                this?.context?.setCredentials(data?.message);
            }
        });


        this?.context?.socket.on('all_devices', (data) => {
            if (data?.successful === true) {
                this?.context?.setDevices(data?.message);
            }
            else {
                console.log(data?.message);
            }
        });


        this?.context?.socket.on('add_device', (data) => {
            if (data?.successful === true) {
                const all_dev = [
                    ...(this?.context?.devices),
                    data?.message
                ];
                this?.context?.setDevices(all_dev);
            }
            else {
                console.log(data?.message)
            }
        });
    }

    autoAuthenticate = async () => {
        await storage.clearAll();
        const user_id = await storage.get("user_id");
        const device_name = await storage.get("device_name");
        const device_token = await storage.get("device_token");
        // console.log({ user_id, device_name, device_token })
        this?.context?.socket.emit("auto_authenticate", { user_id, device_name, device_token })
    }

    render() {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: (this?.context?.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)' }]}>
                <StatusBar animated={true}
                    barStyle={this?.context?.colorScheme == 'dark' ? 'light-content' : 'dark-content'}
                />

                {(this?.context?.credentials !== null) ?
                    (
                        this?.context?.currDeviceName === null ? (
                            [
                                <View style={{ borderBottomColor: '#a9a9a9', borderBottomWidth: 1, width: '100%', alignItems: 'center' }} key="page_label"><Text style={[styles.your_devices, { color: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }]}>Your Devices</Text></View>,
                                <ScrollView key="device_list" style={{ width: '100%' }} contentContainerStyle={styles.devices_container}>
                                    {
                                        this?.context?.devices.map(((x, i) => (
                                            <ScaleTouchableOpacity key={x.device_name} style={{ ...styles.device_box, borderColor: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }} onPress={() => this?.context?.setCurrentDeviceName(x.device_name)} key={`device_${i}`}>
                                                <View style={styles.icon_style}>
                                                    <FontAwesome name={x.device_type} size={50} color={this?.context?.colorScheme === 'dark' ? '#fff' : '#000'} />
                                                </View>

                                                <View>
                                                    <Text style={{ textAlign: 'center', color: this?.context?.colorScheme === 'dark' ? '#fff' : '#000' }}>
                                                        {x.device_name}
                                                    </Text>
                                                    {x.device_name === this?.context?.credentials.device_name && (
                                                        <Text style={{ textAlign: 'center', color: '#1B8E2D', marginTop: 5, }}>
                                                            <FontAwesome name={'circle'} color="#1B8E2D" /> This Device
                                                        </Text>
                                                    )}
                                                </View>
                                            </ScaleTouchableOpacity>
                                        )))
                                    }
                                </ScrollView>,
                                (this?.context?.credentials !== null && this?.context?.credentials !== undefined) ? (
                                    <View style={styles.footer_options} key="footer">
                                        <TouchableOpacity onPress={() => this.navigation.navigate('Help')}>
                                            <MaterialIcons name="help-outline" size={32} color={this?.context?.colorScheme === 'dark' ? '#fff' : '#000'} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.navigation.navigate('Settings', { credentials: this?.context?.credentials, socket: this?.context?.socket })}>
                                            <MaterialIcons name="settings" size={32} color={this?.context?.colorScheme === 'dark' ? '#fff' : '#000'} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.navigation.navigate('Profile')}>
                                            <Image source={{ uri: this?.context?.credentials?.picture }} style={{ width: 32, height: 32, borderRadius: (32 / 2) }} />
                                        </TouchableOpacity>
                                    </View>
                                )
                                    :
                                    null
                            ]
                        )
                            :
                            <DeviceManager navigation={this.navigation} />
                    )
                    :
                    <Login navigation={this.navigation} />
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