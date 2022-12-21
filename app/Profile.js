import { useEffect } from "react";
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ({ navigation, route, ...props }) {
    const colorScheme = useColorScheme();
    const credentials = route.params.credentials;
    const socket = route.params.socket;

    useEffect(() => {
        socket.on("logout", (data) => {
            console.log("LOGGED OUT SEXUXFULLY", data)
        })
    }, [])

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            padding: 10,
        },

        scrollContainer: {
            flex: 1,
        },

        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
        },
        picture: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginRight: 20,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
        },
        infoContainer: {
            flex: 1,
        },
        name: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            fontSize: 20,
            fontWeight: 'bold',
        },
        email: {
            color: colorScheme === 'dark' ? 'rgba(174, 174, 178, 1)' : 'rgba(99, 99, 102, 1)',
            fontSize: 16,
        },
        logoutButton: {
            marginRight: 40,
            marginLeft: 40,
            marginTop: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)',
            borderRadius: 10,
        },
        logoutText: {
            color: colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)',
            textAlign: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 20,
            fontWeight: 'bold'
        }
    })

    const onLogout = () => {
        socket.emit("logout", { user_id: credentials?.user_id, device_name: credentials?.device_name, device_token: credentials?.device_token });
    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                    <Image
                        style={styles.picture}
                        source={{ uri: credentials?.picture }}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{credentials?.name}</Text>
                        <Text style={styles.email}>{credentials?.email}</Text>
                    </View>
                </View>

                <View
                    style={{
                        borderBottomColor: '#a9a9a9',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />

                <View style={styles.container}>
                    <FontAwesome name={credentials?.device_type} size={50} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{credentials?.device_name}</Text>
                    </View>
                </View>

            </ScrollView>

            <View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => onLogout}
                    underlayColor='#fff'>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}