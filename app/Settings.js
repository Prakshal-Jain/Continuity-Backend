import { useState } from "react";
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tiles = ({ icon, title, onSwitch, learnMore, colorScheme, navigation, learnMoreParams }) => {
    const tileStyle = StyleSheet.create({
        container: {
            backgroundColor: (colorScheme === 'dark') ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            width: '100%',
            borderRadius: 10,
            padding: 15,
        },

        tileContainer: {
            flexDirection: "row",
            alignItems: "center",
        },

        title: {
            color: (colorScheme === 'dark') ? '#fff' : '#000',
            fontSize: 18,
            flex: 1,
            fontWeight: "bold"
        },

        link: {
            color: 'rgba(0, 122, 255, 1)',
        }
    });

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        onSwitch(!isEnabled);
        setIsEnabled(!isEnabled);
    }

    return (
        <View style={tileStyle.container}>
            <View style={tileStyle.tileContainer}>
                {icon}
                <Text style={tileStyle.title}>{title}</Text>
                {onSwitch && (
                    <Switch
                        trackColor={{ false: "rgba(28, 28, 30, 1)", true: "rgba(40, 205, 65, 1)" }}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
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
                    <Text onPress={() => navigation.navigate(learnMore, learnMoreParams)} style={tileStyle.link}>Learn more...</Text>
                </View>
            )}
        </View>
    )
}

export default function ({ navigation, route }) {
    const colorScheme = useColorScheme();

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

    const credentials = route.params.credentials;
    const socket = route.params.socket;

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView style={styles.scrollContainer}>
                <Tiles colorScheme={colorScheme} title="Ultra Search" icon={<MaterialCommunityIcons name="lightning-bolt" style={{ marginRight: 15, fontSize: 25 }} color="rgba(255, 149, 0, 1)" />} navigation={navigation} learnMore={"Ultra Search"} onSwitch={() => { }} learnMoreParams={{credentials, socket}} />
            </ScrollView>
        </SafeAreaView>
    )
}