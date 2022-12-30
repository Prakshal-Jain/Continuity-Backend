import { Component } from "react";
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

class DeviceBrowserHistory extends Component {
    static contextType = StateContext;
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            isNext: true,
            history: null,
            target_device: null,
            device_type: null
        }
    }

    componentDidMount() {
        const target_device = this.props?.route?.params?.target_device;
        const device_type = this.props?.route?.params?.device_type;
        this.setState({ target_device, device_type }, () => {
            if (target_device !== null && target_device !== undefined) {
                this.getHistory();
            }
        });

        this?.context?.socket.on('get_history', (data) => {
            if (data?.successful === true) {
                this.setState({ isNext: data?.message?.next, page: (this.state.page + 1) });

                if (this.state.history === null || this.state.history === undefined || this.state.history?.length === 0) {
                    this.setState({ history: data?.message?.history });
                }
                else {
                    if (data?.message?.history[0]?.date === this.state.history[(this.state.history?.length - 1)]?.date) {
                        const newHist = this.state.history;
                        newHist[(newHist.length - 1)].date_history = newHist[(newHist.length - 1)].date_history.concat(data?.message?.history[0]?.date_history);
                        this.setState({ history: [...newHist, ...(data?.message?.history?.slice(1))] });
                    }
                    else {
                        const newHist = [...this.state.history, ...(data?.message?.history)];
                        this.setState({ history: newHist });
                    }
                }
            }
            else {
                this.setState({ isNext: false });
                console.log(data?.message)
            }
        })
    }

    getHistory = () => {
        if (this.state.isNext) {
            this?.context?.socket.emit('get_history', {
                'user_id': this?.context?.credentials?.user_id,
                'device_name': this?.context?.credentials?.device_name,
                'device_token': this?.context?.credentials?.device_token,
                'target_device': this.state.target_device,
                'page': this.state.page
            });
        }
    }


    render() {
        return (
            <SafeAreaView style={[this.styles.root, { backgroundColor: (this?.context?.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)' }]}>
                <StatusBar animated={true}
                    barStyle={this?.context?.colorScheme == 'dark' ? 'light-content' : 'dark-content'}
                />
                <View style={this.styles.scrollContainer}>
                    <FlatList
                        style={{ width: '100%' }}
                        keyExtractor={(item, index) => (this.state.history ?? []).length + index}
                        data={this.state.history}
                        renderItem={({ item, index }) => (
                            <View style={[this.styles.date_container, { backgroundColor: this?.context?.colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)' }]}>
                                <Text style={[this.styles.date_text, { color: this?.context?.colorScheme === 'dark' ? '#fff' : '#000' }]}>{item?.date}</Text>
                                <View
                                    style={{
                                        borderBottomColor: this?.context?.colorScheme === 'dark' ? 'rgba(174, 174, 178, 1)' : 'rgba(99, 99, 102, 1)',
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                    }}
                                />
                                {item?.date_history?.map((hist, i) => (
                                    <View style={[this.styles.history_url, { borderBottomColor: this?.context?.colorScheme === 'dark' ? 'rgba(99, 99, 102, 1)' : 'rgba(174, 174, 178, 1)' }]} key={hist?.id}>
                                        <Text style={{ color: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }} numberOfLines={1}>{hist?.url}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        onEndReached={this.getHistory}
                        onEndReachedThreshold={10}
                        ListHeaderComponent={
                            <View style={{ alignItems: "center", marginBottom: 20 }}>
                                <Text style={[this.styles.heading, { color: this?.context?.colorScheme === 'dark' ? '#fff' : '#000' }]}>Search History</Text>
                                {/* <MaterialCommunityIcons name="history" style={{ fontSize: 30 }}  /> */}
                                <View style={{ flexDirection: "row" }}>
                                    <FontAwesome name={this.state.device_type} size={30} color={this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} />
                                    <Text style={[this.styles.subheading, { color: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }]}>{this.state.target_device}</Text>
                                </View>
                            </View>}
                    />
                </View>

                <View style={this.styles.footer_options}>
                    <View style={[this.styles.deleteAllButtonContainer, { borderColor: this?.context?.colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)' }]}>
                        <Icon style={{ marginRight: 10 }} name="delete" size={20} color={this?.context?.colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)'} onPress={() => { }} />
                        <Text style={[this.styles.deleteAllText, { color: this?.context?.colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)' }]}>Clear Browsing History</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }


    styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            padding: 10,
        },

        scrollContainer: {
            flex: 1,
            padding: 10,
        },

        heading: {
            textAlign: "center",
            fontWeight: 'bold',
            fontSize: 30,
            padding: 10,
        },

        subheading: {
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

        deleteAllButtonContainer: {
            borderWidth: 1,
            borderRadius: 10,
            flexDirection: "row",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            padding: 10
        },

        deleteAllText: {
            textAlign: 'center',
        },

        date_container: {
            marginVertical: 20,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 15,
        },

        date_text: {
            paddingBottom: 15,
            fontSize: 15,
            fontWeight: "bold"
        },

        history_url: {
            paddingVertical: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
        }
    });
}
export default DeviceBrowserHistory;