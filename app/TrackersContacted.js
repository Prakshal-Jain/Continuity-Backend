import { useContext } from "react";
import {
    ScrollView,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    View,
    Image
} from "react-native";
import { StateContext } from "./state_context";
import webIcon from "./assets/web_icon.png";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from "react";


const TrackersContacted = ({ navigation, route }) => {
    const { colorScheme, credentials } = useContext(StateContext);
    const [website, setWebsite] = useState(route?.params?.website);
    const [tracker, setTracker] = useState(route?.params?.tracker);
    const [count, setCount] = useState(route?.params?.count);
    const [color, setColor] = useState(route?.params?.color);

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

        trackerCount: {
            textAlign: "center",
            fontSize: 20,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            padding: 15,
        },

        subHeading: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            fontSize: 25,
            textAlign: "center"
        },

        websiteLogo: {
            width: 60,
            height: 60,
            resizeMode: "contain",
            margin: 15,
            borderRadius: 10,
            borderWidth: 2,
            borderRadius: 30,
        },

        trackerListContainer: {
            marginVertical: 20,
            backgroundColor: colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            borderRadius: 10,
            paddingVertical: 15,
            width: '100%'
        },

        trackerTile: {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colorScheme === 'dark' ? 'rgba(99, 99, 102, 1)' : 'rgba(174, 174, 178, 1)'
        },

        privacyUpgradeBtn: {
            marginRight: 40,
            marginLeft: 40,
            marginBottom: 10,
            padding: 10,
            backgroundColor: 'rgba(40, 205, 65, 1)',
            borderRadius: 10,
            alignItems: "center",
            alignSelf: 'center'
        },

        privacyUpgradeText: {
            color: '#000',
            textAlign: 'center',
            paddingHorizontal: 10,
            fontSize: 16,
            fontWeight: 'bold'
        },

        smallText: {
            color: colorScheme === 'dark' ? 'rgba(174, 174, 178, 1)' : 'rgba(99, 99, 102, 1)',
            marginBottom: 10,
            textAlign: "center"
        },
    });

    let img_url = `https://s2.googleusercontent.com/s2/favicons?domain_url=${website}&sz=128`

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={{ alignItems: "center" }}>
                <Text style={styles.heading}>Trackers Contacted by</Text>
                <Text style={styles.subHeading}>{website}</Text>

                <Image
                    style={[styles.websiteLogo, { borderColor: color }]}
                    source={{ uri: img_url }}
                    defaultSource={webIcon}
                />

                {(!credentials?.enrolled_features?.privacy_prevention?.enrolled) ?
                    (
                        <>
                            <Text style={[styles.smallText, { marginTop: 15 }]}>
                                Prevent trackers from accessing your personal and sensitive information
                            </Text>
                            <TouchableOpacity
                                style={styles.privacyUpgradeBtn}
                                onPress={() => navigation.navigate('Privacy Prevention', { redirectScreen: 'Trackers Contacted' })}
                                underlayColor='#fff'>
                                <MaterialCommunityIcons name="lock-check" style={{ marginBottom: 5, fontSize: 25 }} color="#000" />
                                <Text style={styles.privacyUpgradeText}>Upgrade to Intelligent Privacy Prevention</Text>
                            </TouchableOpacity>
                            <Text style={styles.trackerCount}><Text style={{ fontWeight: 'bold' }}>{count} trackers</Text> contacted this website.</Text>
                        </>
                    )
                    :
                    ((!credentials?.enrolled_features?.privacy_prevention?.switch) ? (
                        <>
                            <Text style={[styles.smallText, { marginTop: 15 }]}>
                                Prevent trackers from accessing your personal and sensitive information
                            </Text>
                            <TouchableOpacity
                                style={styles.privacyUpgradeBtn}
                                onPress={() => navigation?.navigate('Settings', { "action_message": "To begin using Intelligent Privacy Prevention, please turn on the switch.", "feature_name": 'Intelligent Privacy Prevention', "icon_type": "warning" })}
                                underlayColor='#fff'>
                                <Text style={styles.privacyUpgradeText}>Turn on Intelligent Privacy Prevention</Text>
                            </TouchableOpacity>
                            <Text style={styles.trackerCount}><Text style={{ fontWeight: 'bold' }}>{count} trackers</Text> contacted this website.</Text>
                        </>
                    )
                        :
                        <Text style={styles.trackerCount}>Continuity has prevented <Text style={{ fontWeight: 'bold' }}>{count} trackers</Text> from profiling you.</Text>
                    )
                }



                <View style={styles.trackerListContainer}>
                    {tracker?.map((x, i) => (
                        <View style={[(i < (tracker?.length - 1)) && styles.trackerTile, { padding: 20 }]} key={`tracker_id_${i}`}>
                            <Text style={{ color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}>{x}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginVertical: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrackersContacted;