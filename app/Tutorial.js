import { useContext, useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    View,
    Linking,
    Share,
    Image
} from "react-native";
import { StateContext } from "./state_context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import chromeExtension1 from './assets/chromeExtension1.png';
import chromeExtension2 from './assets/chromeExtension2.png';
import chromeExtension3 from './assets/chromeExtension3.png';
import chromeExtension4 from './assets/chromeExtension4.png';
import chromeExtension5 from './assets/chromeExtension5.png';

const Tutorial = ({ navigation, route }) => {
    const { colorScheme, credentials } = useContext(StateContext);
    const [currStep, setCurrStep] = useState(0);

    useEffect(() => {
        navigation.setOptions({
            headerRight: (() =>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }} onPress={() => { navigation.navigate(route?.params?.target_page || 'Your Devices') }}>
                    <Text style={{ color: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)', fontSize: 15 }}>
                        Skip
                    </Text>
                    <Icon name="chevron-right" size={20} style={{ color: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }} />
                </TouchableOpacity>
            ),

            headerLeft: (() => steps[currStep]?.previous !== null && (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }} onPress={() => { setCurrStep(steps[currStep]?.previous) }}>
                    <Icon name="chevron-left" size={20} style={{ color: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }} />
                    <Text style={{ color: (colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)', fontSize: 15 }}>
                        Previous Step
                    </Text>
                </TouchableOpacity>
            ))
        })
    }, [currStep])

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
        },

        scrollContainer: {
            flex: 1,
            padding: 15,
        },

        text_style: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            margin: 10,
            fontSize: 15
        },

        larger_text: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            fontSize: 20,
            textAlign: "center",
            marginVertical: 10
        },

        heading: {
            textAlign: "center",
            fontWeight: 'bold',
            fontSize: 30,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            padding: 10,
        },

        link_container: {
            margin: 15,
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
        },

        link_text: {
            fontWeight: "bold",
            fontSize: 17,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            textAlign: "center"
        },

        nextBtn: {
            backgroundColor: 'rgba(10, 132, 255, 1)',
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            borderRadius: 10,
            margin: 15,
        },

        link: {
            color: 'rgba(10, 132, 255, 1)'
        },

        border_container: {
            margin: 15,
            justifyContent: "center",
            textAlign: 'center',
            alignItems: "center",
            borderWidth: 2,
            borderColor: colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            padding: 15,
            borderRadius: 10
        },

        screenshot_style: {
            width: 360,
            height: 225,
            resizeMode: "contain",
            borderRadius: 10,
        }
    });

    const FooterButtons = () => (
        <>
            <TouchableOpacity style={[styles.nextBtn, { alignSelf: 'center' }]} onPress={() => { navigation.navigate(route?.params?.target_page || 'Your Devices') }}>
                <View style={styles.links}>
                    <Text style={styles.link_text}>Done</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.link_container, { alignSelf: 'center' }]} onPress={() => setCurrStep(0)}>
                <View style={styles.links}>
                    <Text style={{ fontSize: 15, color: colorScheme === 'dark' ? '#fff' : '#000', textAlign: "center" }}>Add more devices</Text>
                </View>
            </TouchableOpacity>
        </>
    )

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'https://chrome.google.com/webstore/detail/continuity/iialcggedkdlcbjfmgbmnjofjnlhpccc'
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const steps = [
        {
            element: (
                <>
                    <Text style={styles.heading}>Let's set up your other devices with Continuity</Text>
                    <Text style={styles.text_style}>To sync all your tabs across multiple devices in real time using Continuity, please select the type of device you would like to set up next.</Text>

                    <TouchableOpacity style={styles.link_container} onPress={() => setCurrStep(1)}>
                        <View style={styles.links}>
                            <MaterialIcons name="android" color={colorScheme === 'dark' ? "#A4C639" : '#669933'} size={25} style={{ marginRight: 10 }} /><Text style={styles.link_text}>Android (Phone or Tablet)</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.link_container} onPress={() => setCurrStep(5)}>
                        <View style={styles.links}>
                            <Icon name="apple" color={colorScheme === 'dark' ? "#fff" : '#000'} size={25} style={{ marginRight: 10 }} /><Text style={styles.link_text}>iOS (Apple iPhone or iPad)</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.link_container} onPress={() => setCurrStep(8)}>
                        <View style={styles.links}>
                            <MaterialIcons name="extension" color="rgba(10, 132, 255, 1)" size={25} style={{ marginRight: 10 }} /><Text style={styles.link_text}>Chrome Extension (Laptop or Desktop)</Text>
                        </View>
                    </TouchableOpacity>
                </>
            ),

            previous: null,
            next: null
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your Android Device</Text>
                    <Text style={[styles.text_style, { textAlign: "center" }]}>Step 1</Text>
                    <Text style={styles.larger_text}>Download the Continuity App on your Android device.</Text>
                </>
            ),

            previous: 0,
            next: 2
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your Android Device</Text>
                    <Text style={[styles.text_style, { textAlign: "center" }]}>Step 2</Text>
                    <Text style={styles.larger_text}>Use the Email ID:</Text>
                    <Text style={[styles.larger_text, { fontWeight: "bold" }, styles.border_container]}>{credentials?.user_id}</Text>
                    <Text style={styles.larger_text}>to log into continuity on your Android device.</Text>
                </>
            ),

            previous: 1,
            next: 3
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your Android Device</Text>
                    <Text style={[styles.text_style, { textAlign: "center" }]}>Step 3</Text>
                    <Text style={styles.larger_text}>Enter a device name which is <Text style={{ fontWeight: "bold" }}>different</Text> from your this device. For example:</Text>
                    <Text style={[styles.larger_text, { fontWeight: "bold" }, styles.border_container]}>{'Android ' + credentials?.device_name}</Text>
                </>
            ),

            previous: 2,
            next: 4
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Congratulations!</Text>
                    <Text style={styles.larger_text}>All your devices are now in sync.</Text>
                    <Text style={styles.larger_text}>If you have any questions, please send us an email at <Text style={styles.link} onPress={() => Linking.openURL('mailto:continuitybrowser@gmail.com')}>continuitybrowser@gmail.com</Text>.</Text>
                    <FooterButtons />
                </>
            ),

            previous: 3,
            next: null
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your iOS Device</Text>
                    <Text style={[styles.text_style, { textAlign: "center" }]}>Step 1</Text>
                    <Text style={styles.larger_text}>Download the Continuity App on your iOS device.</Text>
                </>
            ),

            previous: 0,
            next: 6
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your iOS Device</Text>
                    <Text style={[styles.text_style, { textAlign: "center" }]}>Step 2</Text>
                    <Text style={styles.larger_text}>Use the Email ID:</Text>
                    <Text style={[styles.larger_text, { fontWeight: "bold" }, styles.border_container]}>{credentials?.user_id}</Text>
                    <Text style={styles.larger_text}>to log into continuity on your iOS device.</Text>
                </>
            ),

            previous: 5,
            next: 7
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your iOS Device</Text>
                    <Text style={[styles.text_style, { textAlign: "center" }]}>Step 3</Text>
                    <Text style={styles.larger_text}>Enter a device name which is <Text style={{ fontWeight: "bold" }}>different</Text> from your this device. For example:</Text>
                    <Text style={[styles.larger_text, { fontWeight: "bold" }, styles.border_container]}>{'iOS ' + credentials?.device_name}</Text>
                </>
            ),

            previous: 6,
            next: 4
        },

        {
            element: (
                <>
                    <Text style={styles.heading}>Setup your Chrome Extension</Text>
                    <Text style={styles.larger_text}>Enter the URL on your desktop's or laptop's Chrome browser to visit the Continuity page on Chrome Web Store</Text>
                    <Text style={[styles.larger_text, { fontWeight: "bold" }, styles.border_container]}>https://bit.ly/3wEeeME</Text>
                    <Text style={styles.larger_text}>OR</Text>

                    <TouchableOpacity style={[styles.link_container, { alignSelf: 'center' }]} onPress={onShare}>
                        <View style={styles.links}>
                            <Text style={{ fontSize: 15, color: colorScheme === 'dark' ? '#fff' : '#000', textAlign: "center" }}>Share this link to your desktop / laptop</Text>
                        </View>
                    </TouchableOpacity>
                </>
            ),

            previous: 0,
            next: 9
        },

        {
            element: (
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.heading}>Setup your Chrome Extension</Text>
                    <Text style={styles.larger_text}>Click on <Text style={{ fontWeight: "bold" }}>Add to Chrome</Text> button.</Text>
                    <Image
                        style={styles.screenshot_style}
                        source={chromeExtension1}
                    />
                </View>
            ),

            previous: 8,
            next: 10
        },

        {
            element: (
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.heading}>Setup your Chrome Extension</Text>
                    <Text style={styles.larger_text}>Click <Text style={{ fontWeight: "bold" }}>Add extension</Text> button.</Text>
                    <Image
                        style={styles.screenshot_style}
                        source={chromeExtension2}
                    />
                </View>
            ),

            previous: 9,
            next: 11
        },

        {
            element: (
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.heading}>Setup your Chrome Extension</Text>
                    <Text style={styles.larger_text}>Click on <MaterialIcons name="extension" color="rgba(10, 132, 255, 1)" size={20} style={{ marginHorizontal: 10 }} /> icon to see all your extensions.</Text>
                    <Image
                        style={styles.screenshot_style}
                        source={chromeExtension3}
                    />
                </View>
            ),

            previous: 10,
            next: 12
        },

        {
            element: (
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.heading}>Setup your Chrome Extension</Text>
                    <Text style={styles.larger_text}>Click on <Text style={{ fontWeight: "bold" }}>Continuity</Text> extension to start.</Text>
                    <Image
                        style={styles.screenshot_style}
                        source={chromeExtension4}
                    />
                </View>
            ),

            previous: 11,
            next: 13
        },

        {
            element: (
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.heading}>Setup your Chrome Extension</Text>
                    <Text style={styles.larger_text}>Enter the <Text style={{ fontWeight: "bold" }}>Device Name</Text> and <Text style={{ fontWeight: "bold" }}>Device Type</Text>.</Text>
                    <Text style={styles.larger_text}>Then, click on <Text style={{ fontWeight: "bold" }}>Get Started</Text> button.</Text>
                    <Image
                        style={styles.screenshot_style}
                        source={chromeExtension5}
                    />
                </View>
            ),

            previous: 12,
            next: 4
        },
    ]



    return (
        <SafeAreaView style={styles.root}>
            <ScrollView style={styles.scrollContainer}>
                {steps[currStep]?.element}
                {steps[currStep]?.next !== null && (
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity style={[styles.nextBtn, { alignSelf: 'flex-end' }]} onPress={() => setCurrStep(steps[currStep]?.next)}>
                            <View style={styles.links}>
                                <Text style={styles.link_text}>Next</Text><FontAwesome name="angle-right" size={20} color={(colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} style={{ marginLeft: 6 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ marginVertical: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Tutorial;