import { useContext } from "react";
import {
    ScrollView,
    Text,
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    StatusBar,
    View,
    Image
} from "react-native";
import { StateContext } from "./state_context";
import webIcon from "./assets/web_icon.png"


const TrackersContacted = ({ route }) => {
    const { colorScheme } = useContext(StateContext);

    const { website, tracker, count, color } = route?.params;

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
            padding: 15,
            width: '100%'
        },

        trackerTile: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? 'rgba(142, 142, 147, 1)' : 'rgba(72, 72, 74, 1)',
        }
    });

    let img_url = `https://s2.googleusercontent.com/s2/favicons?domain_url=${website}&sz=128`

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView style={styles.scrollContainer} contentContainerStyle={{ alignItems: "center" }}>
                <Text style={styles.heading}>Trackers Contacted by</Text>
                <Text style={styles.subHeading}>{website}</Text>

                <Image
                    style={[styles.websiteLogo, { borderColor: color }]}
                    source={{ uri: img_url }}
                    defaultSource={webIcon}
                />

                <Text style={styles.trackerCount}>Number of trackers: <Text style={{ fontWeight: 'bold' }}>{count}</Text></Text>

                <View style={styles.trackerListContainer}>
                    {tracker?.map((x, i) => (
                        <View style={[(i < (tracker?.length - 1)) && styles.trackerTile, { padding: 20 }]} key={`tracker_id_${i}`}>
                            <Text style={{ color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}>{x}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrackersContacted;