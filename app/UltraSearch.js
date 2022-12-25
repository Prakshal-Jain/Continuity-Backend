import { useEffect } from "react";
import {
    ScrollView,
    Text,
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    StatusBar,
    View,
    TouchableOpacity
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const UltraSearch = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const credentials = route.params.credentials;
    const socket = route.params.socket;

    useEffect(() => {
        socket.on("enroll_feature", (data) => {
            if (data?.successful) {
                navigation.navigate('Settings', { credentials, socket });
            }
        })
    })

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
            padding: 10,
        },

        text_style: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            padding: 10,
        },

        heading: {
            textAlign: "center",
            fontWeight: 'bold',
            fontSize: 30,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            padding: 10,
        },

        upgradeBtn: {
            marginRight: 40,
            marginLeft: 40,
            marginTop: 15,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: 'rgba(255, 149, 0, 1)',
            borderRadius: 10,
        },

        upgradeText: {
            color: '#fff',
            textAlign: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 20,
            fontWeight: 'bold'
        }
    });

    const upgradeUltraSearch = () => {
        socket.emit('enroll_feature', {
            user_id: credentials?.user_id,
            device_name: credentials?.device_name,
            device_token: credentials?.device_token,
            feature_name: "ultra_search_query"
        })
    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.heading}>Ultra Search</Text>
                <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons name="lightning-bolt" style={{ marginRight: 15, fontSize: 25 }} color="rgba(255, 149, 0, 1)" />
                </View>

                <Text style={styles.text_style}>
                    Are you tired of sifting through irrelevant search results and worrying about online safety? Ultra Search is here to change the way you search the web.
                </Text>
                <Text style={styles.text_style}>
                    Our advanced AI technology uses OpenAI's API to provide quick and accurate suggestions to your queries, custom tailored to your specific needs. And for the first time ever, Ultra Search is seamlessly integrated into your web browser, making it a powerful tool for all of your online searches.
                </Text>
                <Text style={styles.text_style}>
                    But that's not all - Ultra Search also ensures that the content you see is safe and appropriate for all users, and your privacy is always protected as we never share your information with third parties or with Continuity.
                </Text>
                <Text style={styles.text_style}>
                    Upgrade your search game for just $4.99 per month - that's even less than the cost of a cup of coffee! Don't miss out on this opportunity to improve your online search experience with Ultra Search. Try it out today and see the difference for yourself.
                </Text>

                <TouchableOpacity
                    style={styles.upgradeBtn}
                    onPress={upgradeUltraSearch}
                    underlayColor='#fff'>
                    <Text style={styles.upgradeText}>Upgrade to Ultra Search</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UltraSearch;