import { StateContext } from "./state_context";
import { SafeAreaView, StatusBar, StyleSheet, ScrollView, Text } from "react-native";
import React, { Component } from "react";

class Notifications extends Component {
    static contextType = StateContext;
    constructor(props) {
        super(props);

        this.state = {
            notifications: null
        }
    }

    navigation = this.props?.navigation;

    componentDidMount = () => {
        this?.context?.socket.on('get_notification', (data) => {
            console.log(data);
            if (data?.successful === true) {
                this.setState({ notifications: data?.message })
            }
            else {
                console.log(data?.message);
            }
        });

        this?.context?.socket.emit("get_notification", { user_id: this?.context?.credentials?.user_id, device_token: this?.context?.credentials?.device_token, device_name: this?.context?.credentials?.device_name })
    }

    render() {
        return (
            <SafeAreaView style={[styles.root, { backgroundColor: (this?.context?.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)' }]}>
                <StatusBar animated={true}
                    barStyle={this?.context?.colorScheme == 'dark' ? 'light-content' : 'dark-content'}
                />
                <ScrollView style={{ width: '100%', flex: 1, padding: 10 }}>
                    <Text style={{ marginVertical: 10, textAlign: "center", color: this?.context?.colorScheme === 'dark' ? 'rgba(174, 174, 178, 1)' : 'rgba(99, 99, 102, 1)', }}>Your notifications will show up here...</Text>
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
});

export default Notifications;