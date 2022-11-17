import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, TextInput, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class Tabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            searchQuery: ""
        }
    }

    addNewTab = () => {
        this.props.addNewTab("https://www.google.com");
    }

    renderMetadata = () => {
        const tabs = [];
        const filtered = Array.from(this.props.metadata).filter(x => (x[1].title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) || (x[1].url.toLowerCase().includes(this.state.searchQuery.toLowerCase())))
        for (const [key, tab] of filtered) {
            let img_url =
                `https://s2.googleusercontent.com/s2/favicons?domain_url=${tab.url}&sz=64`
            tabs.push(
                <View key={key} style={styles.tabTitle}>
                    <TouchableOpacity onPress={() => this.props.switchCurrOpenWindow(key)}>
                        <Image
                            style={{ width: 40, height: 40, resizeMode: "contain", margin: 10, borderRadius: 10, }}
                            source={{ uri: img_url }}
                            onError={() => {
                                img_url = 'https://www.nicepng.com/png/full/170-1709508_web-solutions-web-icon-white-png.png'
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', paddingVertical: 15, paddingLeft: 15, flex: 1, marginRight: 5 }} onPress={() => this.props.switchCurrOpenWindow(key)} numberOfLines={2}>{tab.title}</Text>
                    <FontAwesome name="close" size={20} color="#e23838" style={{ padding: 15 }} onPress={() => this.props.removeTab(key)} />
                </View>
            )
        }
        return tabs;
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.clearTabCache();
        this.setState({ refreshing: false });
    }

    onSearch = (text) => {
        this.setState({ searchQuery: text });
    }

    render() {
        const tabCount = this.props.metadata.size;
        return (
            <View style={styles.root}>
                <View style={styles.tab_count}>
                    <Text style={{ color: 'black', textAlign: "center" }}>{this.props.device_name} <FontAwesome name={this.props.device_type} size={18} color="#28282B" /></Text>
                    <Text style={{ color: 'black', textAlign: "center", fontWeight: "bold" }}>
                        {tabCount} {tabCount === 1 ? "Tabs" : "Tab"}
                    </Text>
                </View>

                <ScrollView style={styles.tabsContainer} contentContainerStyle={{ paddingVertical: 15 }} refreshControl={
                    tabCount > 0 ? (
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    )
                        : null
                }>
                    {tabCount > 0 && (
                        <View>
                            <Text style={{ color: 'gray', textAlign: "center" }}>Pull to sync with other devices</Text>
                            <View style={styles.searchBar}>
                                <FontAwesome name="search" style={{ marginRight: 12, fontSize: 18 }} color="#a9a9a9" />
                                <TextInput
                                    onChangeText={this.onSearch}
                                    style={styles.searchBox}
                                    placeholder="Search Tabs"
                                    value={this.state.searchQuery}
                                />
                                {this.state.searchQuery.length > 0 && (
                                    <Icon name="close-circle-outline" style={{ marginRight: 12, fontSize: 18 }} color="#a9a9a9" onPress={() => { this.setState({ searchQuery: "" }) }} />
                                )}
                            </View>
                        </View>
                    )}
                    {this.props.metadata.size > 0 ?
                        this.renderMetadata()
                        :
                        <View style={styles.centerAligned}>
                            <Text>
                                No open tabs on <Text style={{ fontWeight: "bold" }}>{this.props.device_name}</Text> <FontAwesome name={this.props.device_type} size={18} color="#28282B" />
                            </Text>
                            <Text>
                                Click on the <Icon name="plus-circle-outline" size={18} color="#06c" /> icon below to open a new tab.
                            </Text>
                        </View>
                    }
                </ScrollView>
                <View style={styles.footer_options}>
                    <MaterialIcons name="devices" size={40} color="#28282B" onPress={() => this.props.setCurrentDeviceName(null)} />
                    <Icon name="plus-circle-outline" size={50} color="#06c" onPress={this.addNewTab} />
                    <Icon name="delete" size={40} color="#e23838" onPress={this.props.deleteAllTabs} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
    },
    tabsContainer: {
        width: Dimensions.get('window').width,
    },
    browserBar: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 15,
    },
    tab_count: {
        borderBottomWidth: 1,
        width: '100%',
        padding: 5,
        borderBottomColor: '#28282B',
        marginTop: 5,
    },
    centerAligned: {
        paddingVertical: 15,
        alignSelf: "center",
        alignItems: "center"
    },
    tabTitle: {
        alignItems: "center",
        backgroundColor: '#28282B',
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        flexDirection: "row",
        paddingVertical: 7,
    },
    footer_options: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-between",
        width: Dimensions.get('window').width,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#a9a9a9'
    },
    searchBar: {
        backgroundColor: 'white',
        shadowColor: '#171717',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 12,
        margin: 20,
        borderWidth: 0.1,
        borderColor: '#171717',
        alignItems: "center"
    },
    searchBox: {
        flex: 1,
        marginRight: 8
    },
});

export default Tabs