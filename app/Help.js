import { useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StateContext } from "./state_context";
import logo from './assets/logo.png'


export default function ({ navigation, ...props }) {
    const { colorScheme, credentials, setCurrentDeviceName } = useContext(StateContext);

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
        },

        container: {
            padding: 20,
        },

        question: {
            marginTop: 10,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colorScheme === 'dark' ? '#fff' : '#000',
        },

        answer: {
            fontSize: 16,
            marginBottom: 20,
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
        },

        item_container: {
            paddingVertical: 10,
            borderBottomColor: colorScheme === 'dark' ? 'rgba(99, 99, 102, 1)' : 'rgba(174, 174, 178, 1)',
        },

        heading: {
            textAlign: "center",
            fontWeight: 'bold',
            fontSize: 30,
            padding: 10,
            color: colorScheme === 'dark' ? '#fff' : '#000',
        },

        link_container: {
            marginVertical: 15,
            justifyContent: "center",
            textAlign: 'center',
            alignItems: "center",
            backgroundColor: colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            padding: 15,
            borderRadius: 10
        },

        links: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: "center",
            flexWrap: 'wrap',
            justifyContent: "center",
            marginBottom: 5
        },

        link_text: {
            fontWeight: "bold",
            fontSize: 15,
            color: colorScheme === 'dark' ? '#fff' : '#000',
        },

        subheading: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 30,
            textAlign: "center",
        }
    })

    const renderRow = (heading, data) => {
        return (
            <Text style={styles.answer}><FontAwesome name="check-circle" style={{ fontSize: 14 }} color={colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} /> <Text style={{ color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)', fontWeight: "bold" }}>{heading}</Text>: {data}</Text>
        );
    }

    const navigateToTabUrl = (url) => {
        setCurrentDeviceName(credentials?.device_name);
        navigation?.navigate("Tabs", { url })
    }


    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView style={styles.container}>
                <Text style={styles.heading}>Help</Text>

                <TouchableOpacity style={styles.link_container} onPress={() => navigateToTabUrl('https://discord.gg/TwJ863WJsQ')}>
                    <View style={styles.links}>
                        <MaterialCommunityIcons name="discord" color="rgba(88, 101, 242, 1)" size={30} style={{ marginRight: 5 }} /><Text style={styles.link_text}>Join Our Discord Server</Text>
                    </View>
                    <Text style={{ color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}>for speedy and personalized assistance.</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.link_container} onPress={() => navigateToTabUrl('https://continuitybrowser.com/help')}>
                    <View style={styles.links}>
                        <Image
                            source={logo}
                            style={{ marginRight: 5, width: 30, height: 30, borderRadius: 5 }}
                        />
                        <Text style={styles.link_text}>Visit the Help page on our website</Text>
                    </View>
                    <Text style={{ color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}>to view the most recent FAQs.</Text>
                </TouchableOpacity>


                <Text style={styles.subheading}>Common Questions</Text>
                <View style={[styles.item_container, { borderBottomWidth: 1 }]}>
                    <Text style={styles.question}>
                        How can I access my webpages across all my devices with Continuity?
                    </Text>
                    <Text style={styles.answer}>
                        Continuity makes it easy to access your webpages on all your devices at once. All you need to do is sign in to the Continuity app and chrome extension with the same google account on each device, and your tabs will automatically sync in real time. No hassle, no fuss. Try it out and see how convenient it can be!
                    </Text>
                </View>

                <View style={styles.item_container}>
                    <Text style={styles.question}>
                        What are some key features of Continuity?
                    </Text>
                    {renderRow("Ultra Search", "Continuity not just smart but a creative browser! UltraSearch provides quick, precise, and personalized suggestions to your questions generated by AI, and custom tailored just for you, making it easier than ever to find what you're looking for.")}
                    {renderRow("Intelligent Privacy Report", "Continuity offers in-depth tracking protection and reports on websites that may collect your personal information, providing a secure, private, and powerful browsing experience.")}
                    {renderRow("Real-time tab synchronization", "Continuity allows you to access your tabs across all your devices in real-time, regardless of their operating system. Currently, Continuity works on Android, iPhones, and Windows devices, with plans to expand to other systems.")}
                    {renderRow("A seamless user experience", "Continuity is designed to provide a smooth, productive, and efficient browsing experience.")}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}