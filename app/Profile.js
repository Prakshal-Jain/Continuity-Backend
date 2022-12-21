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

export default function ({ route, ...props }) {
    const colorScheme = useColorScheme();
    const credentials = route.params.credentials;
    console.log(credentials);

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            padding: 10,
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
    })


    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />

            <ScrollView>
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

                <Text style={styles.title}>{credentials.device_name}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}