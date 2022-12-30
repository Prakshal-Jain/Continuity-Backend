import { useContext, useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    View,
    FlatList
} from "react-native";
import { StateContext } from "./state_context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PrivacyPolicy = ({ route }) => {
    const { colorScheme, credentials, socket } = useContext(StateContext);
    const { target_device, device_type } = (route?.params) ?? { target_device: undefined, device_type: undefined };
    const [page, setPage] = useState(0);
    const [isNext, setIsNext] = useState(false);
    const [history, setHistory] = useState(null);

    useEffect(() => {
        if (target_device !== null && target_device !== undefined) {
            getHistory();
        }

        socket.on('get_history', (data) => {
            // Handle data here
        })
    }, []);

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

        subheading: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            fontSize: 25,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
            fontWeight: 'bold',
        },

        footer_options: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: "center",
            width: '100%',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderTopWidth: 0.5,
            borderTopColor: '#a9a9a9'
        },

        logoutButtonContainer: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)',
            borderRadius: 10,
            flexDirection: "row",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            padding: 10
        },
        logoutText: {
            color: colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)',
            textAlign: 'center',
        },
    });

    const getHistory = () => {
        // socket.emit('get_history', { user_id: credentials?.user_id, device_name: credentials?.device_name, device_token: credentials?.device_token, target_device });
        console.log("Get more history");
        const oldHist = history ?? []
        setTimeout(() => {
            setHistory([...oldHist, ...Array(50).fill(0).map((_, i) => `WassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassupppWassuppp ${oldHist.length + i}`)])
        }, 500)
    }

    const deleteAllHistory = () => {

    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <View style={styles.scrollContainer}>
                <FlatList
                    style={{ width: '100%' }}
                    keyExtractor={(item, index) => (history ?? []).length + index}
                    data={history}
                    renderItem={({ item, index }) => (
                        <Text style={{ color: '#fff' }}>
                            {item}
                        </Text>
                    )}
                    onEndReached={getHistory}
                    onEndReachedThreshold={10}
                    ItemSeparatorComponent={() => <View
                        style={{
                            borderBottomColor: '#a9a9a9',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginVertical: 20,
                        }}
                    />}
                    ListHeaderComponent={
                        <View style={{ alignItems: "center", marginBottom: 20 }}>
                            <Text style={styles.heading}>Search History</Text>
                            {/* <MaterialCommunityIcons name="history" style={{ fontSize: 30 }}  /> */}
                            <View style={{ flexDirection: "row" }}>
                                <FontAwesome name={device_type} size={30} color={colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} />
                                <Text style={styles.subheading}>{target_device}</Text>
                            </View>
                        </View>}
                />
            </View>

            <View style={styles.footer_options}>
                <View style={styles.logoutButtonContainer}>
                    <Icon style={{ marginRight: 10 }} name="delete" size={20} color={colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)'} onPress={deleteAllHistory} />
                    <Text style={styles.logoutText}>Clear Browsing History</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PrivacyPolicy;