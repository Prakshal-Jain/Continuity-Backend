import { useContext, useEffect } from "react";
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
    Switch,
} from "react-native";
import React from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StateContext } from "./state_context";
import AlertMessage from "./components/AlertMessage";

function Settings({ navigation, route }) {
    const { colorScheme, credentials, socket, setCredentials } = useContext(StateContext);

    const { action_message, feature_name, icon_type } = route?.params ?? { action_message: undefined, feature_name: undefined };

    useEffect(() => {
        socket.on("switch_feature", (data) => {
            if (data?.successful) {
                setCredentials(data?.message);
            }
            else {
                console.log(data?.message);
            }
        })
    }, [])

    const Tiles = ({ icon, title, onSwitch, learnMore, colorScheme, isSwitchEnabled }) => {
        const tileStyle = StyleSheet.create({
            container: {
                backgroundColor: (colorScheme === 'dark') ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
                width: '100%',
                borderRadius: 10,
                padding: 15,
                borderWidth: (feature_name === title) ? 2 : undefined,
                borderColor: (feature_name === title) ? ((colorScheme === 'dark') ? 'rgba(255, 214, 10, 1)' : 'rgba(255, 149, 0, 1)') : undefined,
            },

            tileContainer: {
                flexDirection: "row",
                alignItems: "center",
            },

            title: {
                color: (colorScheme === 'dark') ? '#fff' : '#000',
                fontSize: 18,
                flex: 1,
                fontWeight: "bold",
            },

            link: {
                color: 'rgba(0, 122, 255, 1)',
            }
        });

        const toggleSwitch = () => {
            onSwitch(!isSwitchEnabled);
        }

        return (
            <View style={tileStyle.container}>
                <View style={tileStyle.tileContainer}>
                    {icon}
                    <Text style={tileStyle.title}>{title}</Text>
                    {onSwitch && (
                        <Switch
                            onValueChange={toggleSwitch}
                            value={isSwitchEnabled}
                            disabled={(credentials?.enrolled_features?.ultra_search?.enrolled === false)}
                        />
                    )}
                </View>
                {(learnMore !== null && learnMore !== undefined) && (
                    <View>
                        <View
                            style={{
                                borderBottomColor: 'rgba(142, 142, 147, 1)',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                marginVertical: 10
                            }}
                        />
                        <Text onPress={() => navigation.navigate(learnMore)} style={tileStyle.link}>Learn more...</Text>
                    </View>
                )}
            </View>
        )
    }




    const styles = StyleSheet.create({
        root: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
        },

        scrollContainer: {
            flex: 1,
            width: '100%',
            padding: 20,
        }
    })


    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView style={styles.scrollContainer}>
                {(action_message !== undefined && action_message !== null) && (
                    <View style={{marginBottom: 15}}>
                        <AlertMessage type={icon_type} message={action_message} />
                    </View>
                )}
                <Tiles
                    colorScheme={colorScheme}
                    title="Ultra Search"
                    icon={<MaterialCommunityIcons
                        name="lightning-bolt"
                        style={{ marginRight: 15, fontSize: 25 }}
                        color="rgba(255, 149, 0, 1)" />}
                    learnMore={"Ultra Search"}
                    onSwitch={() => { socket.emit('switch_feature', { user_id: credentials?.user_id, device_name: credentials?.device_name, device_token: credentials?.device_token, feature_name: "ultra_search", switch: (!credentials?.enrolled_features?.ultra_search?.switch) }) }}
                    isSwitchEnabled={credentials?.enrolled_features?.ultra_search?.switch}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default React.memo(Settings);