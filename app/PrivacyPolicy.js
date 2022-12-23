import {
    ScrollView,
    Text,
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    StatusBar,
    View
} from "react-native";


const PrivacyPolicy = (navigation, route) => {
    const colorScheme = useColorScheme();

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
            margin: 10,
        },

        heading: {
            textAlign: "center",
            fontWeight: 'bold',
            fontSize: 30,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            padding: 10,
        },
    });

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.heading}>Continuity Privacy Policy</Text>
                <Text style={styles.text_style}>Welcome to the <Text style={{ fontWeight: "bold" }}>Continuity</Text> app, a browser that seamlessly syncs tabs across all your devices in real-time. At Continuity, we value your privacy and are committed to protecting it. This privacy policy notice explains how we collect, use, and share your personal information when you use our app.</Text>
                <Text style={styles.text_style}>Please note that only the URLs of the tabs are shared across devices. We do not share any cookies, browser storage, or any other information. To ensure the security and privacy of your data, we encrypt the URLs before saving them on our databases. This means that the synchronization of tabs between devices is end-to-end encrypted.</Text>

                <Text style={styles.text_style}>To identify your account, we use your email id via Google authentication. In addition, we use your Google profile picture to set the default profile photo for your account. Please note that we do not collect or store any device information or personal information. All of this information is encrypted and stored securely on your device.</Text>

                <Text style={styles.text_style}>Thank you for choosing Continuity. If you have any questions or concerns about our privacy policy, please do not hesitate to contact us at <Text style={{ fontWeight: "bold" }}>prakshaljain422@gmail.com</Text>.</Text>

                <View
                    style={{
                        borderBottomColor: '#a9a9a9',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 20,
                    }}
                />

                <Text style={{ color: colorScheme === 'dark' ? 'rgba(142, 142, 147, 1)' : 'rgba(72, 72, 74, 1)', textAlign: "center" }}>Updated December 22, 2022</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PrivacyPolicy;