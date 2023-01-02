import { useContext } from "react";
import { View, Image, Text, ScrollView, ActivityIndicator } from "react-native";
import { StateContext } from "../state_context";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";

const messages = [
    "Sync tabs across devices with Continuity",
    "AI-generated suggestions with UltraBrowser",
    "Tracking protection and personal info reports",
    "Advanced encryption and privacy features",
    "Seamless, synchronized browsing with Continuity",
    "Continuity keeps tabs in sync",
    "UltraBrowser = AI magic",
    "Privacy protection with Continuity",
    "Encrypted browsing with Continuity",
    "Synced tabs across devices",
    "UltraBrowser helps you find things",
    "Tracking protection with Continuity",
    "Secure browsing with Continuity",
    "Continuity = seamless browsing",
    "UltraBrowser = AI-generated responses"

]

export default function () {
    const { colorScheme } = useContext(StateContext);

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <View style={{ alignItems: "center" }}>
                <Image source={colorScheme === 'dark' ? logoLight : logoDark} style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 10 }} />
            </View>
            <ActivityIndicator />
            {/* <View>
                <Text style={{ marginTop: 10, textAlign: 'center', marginVertical: 10, color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)', fontSize: 16 }}>
                    {messages[Math.floor(Math.random() * messages.length)]}
                </Text>
            </View> */}
        </View>
    )
}