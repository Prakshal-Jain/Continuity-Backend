import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { StateContext } from "./state_context";

class UltraSearchResult extends Component {
    static contextType = StateContext;
    constructor(props) {
        super(props);


        this.state = {
            ultra_search_prompt: this.props?.route?.params?.ultra_search_prompt,
            ultra_search_response: null
        }
    }

    componentDidMount = () => {
        const query_creds = {
            'user_id': this?.context?.credentials?.user_id,
            'device_name': this?.context?.credentials?.device_name,
            'device_token': this?.context?.credentials?.device_token,
            'prompt': this.state.ultra_search_prompt
        }
        this?.context?.socket.emit('ultra_search_query', query_creds)

        this?.context?.socket.on('ultra_search_query', (data) => {
            console.log(data);
            if (data?.successful === true) {
                if (data?.message?.prompt === this.state.ultra_search_prompt) {
                    this.setState({ ultra_search_response: data?.message?.response })
                }
            }
            else {
                console.log(data?.message)
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: (this?.context?.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)' }]}>
                <StatusBar animated={true}
                    barStyle={this?.context?.colorScheme == 'dark' ? 'light-content' : 'dark-content'}
                />
                <ScrollView style={styles.scrollContainer}>
                    <View style={[styles.prompt_container, { backgroundColor: (this?.context?.colorScheme === 'dark') ? '#rgba(44, 44, 46, 1)' : 'rgba(229, 229, 234, 1)' }]}>
                        <Text style={[styles.prompt_style, { color: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }]}>
                            {this.state.ultra_search_prompt}
                        </Text>
                    </View>

                    <View>

                        {
                            (this.state.ultra_search_response !== null && this.state.ultra_search_response !== undefined)
                                ?
                                (
                                    <Text style={[styles.response_style, { color: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)', fontSize: 20 }]}>
                                        {this.state.ultra_search_response}
                                    </Text>
                                )
                                :
                                (
                                    <View style={styles.activity_indicator}>
                                        <View>
                                            <ActivityIndicator />
                                        </View>
                                        <View>
                                            <Text style={[styles.response_style, { textAlign: 'center', marginVertical: 10, color: this?.context?.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }]}>
                                                Searching for the best results for you...
                                            </Text>
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },

    scrollContainer: {
        flex: 1,
        padding: 15,
        flex: 1,
        width: '100%'
    },

    prompt_container: {
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    prompt_style: {
        marginVertical: 10,
        textAlign: "center",
        fontWeight: "bold"
    },

    response_style: {
        marginVertical: 10,
    },

    activity_indicator: {
        marginVertical: 20
    }
})


export default UltraSearchResult;