import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Browser from './Browser';
import Tabs from './Tabs';

class DeviceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currOpenTab: -1,
            tabs: new Map(),
            id: 0,
            metadata: new Map(),
        }
    }

    componentDidMount = () => {
        this.props.socket.emit("get_my_tabs", { "user_id": this.props.credentials?.user_id, "device_name": this.props.tabs_data?.device_name, "device_token": this.props.credentials?.device_token })

        this.props.socket.on("get_my_tabs", (data) => {
            if (data?.successful === true) {
                const metadata_list = Object.entries(data?.message).map(([key, value]) => [Number(key), value]);
                const id = metadata_list.length === 0 ? 0 : ((metadata_list.reduce((a, b) => a[1] > b[1] ? a : b, 0)[0]) + 1);
                this.setState({ metadata: new Map(metadata_list), id: id });
            }
            else {
                console.log(data?.message);
            }
        })

        this.props.socket.on('add_tab', (data) => {
            if (data?.successful === true) {
                if (data?.message?.device_name !== this.props?.tabs_data?.device_name) {
                    return
                }
                const metadata_list = Object.entries(data?.message?.tabs_data).map(([key, value]) => [Number(key), value]);
                const idx = metadata_list[0][0]
                const metadata = this.state.metadata;
                const to_add = data?.message?.tabs_data[String(idx)];
                const id = metadata_list.length === 0 ? 0 : (Number(metadata_list.reduce((a, b) => a[1] > b[1] ? a : b, 0)[0]) + 1);
                metadata.set(idx, to_add);
                this.setState({ metadata: metadata, id: id })
            }
            else {
                console.log(data?.message);
            }
        });

        this.props.socket.on('update_tab', (data) => {
            if (data?.successful === true) {
                if (data?.message?.device_name !== this.props?.tabs_data?.device_name) {
                    return
                }

                const metadata_list = Object.entries(data?.message?.tabs_data).map(([key, value]) => [Number(key), value]);
                const idx = metadata_list[0][0]

                const metadata = this.state.metadata;
                const to_add = data?.message?.tabs_data[String(idx)];
                const id = metadata_list.length === 0 ? 0 : (Number(metadata_list.reduce((a, b) => a[1] > b[1] ? a : b, 0)[0]) + 1);
                metadata.set(idx, to_add);
                this.setState({ metadata: metadata, id: id })

                // Check if the updated index exist in the tabs map, and NOT in use            
                if (this.state.tabs.has(idx) && idx !== this.state.currOpenTab) {
                    const tabs_backup = this.state.tabs;
                    tabs_backup.delete(idx);
                    this.setState({ tabs: tabs_backup });
                }
            }
            else {
                console.log(data?.message);
            }
        });

        this.props.socket.on('remove_all_tabs', (data) => {
            if (data?.successful === true) {
                if (data?.message?.device_name !== this.props?.tabs_data?.device_name) {
                    return
                }

                this.setState({
                    currOpenTab: -1,
                    tabs: new Map(),
                    id: 0,
                    metadata: new Map(),
                })
            }
            else {
                console.log(data?.message);
            }
        })

        this.props.socket.on('remove_tab', (data) => {
            if (data?.successful === true) {
                data.message.id = Number(data?.message?.id);
                if (data?.message?.device_name !== this.props?.tabs_data?.device_name) {
                    return
                }

                const metadata = this.state.metadata;
                const tabs = this.state.tabs;

                if (metadata.has(data?.message?.id)) {
                    metadata.delete(data?.message?.id);
                }
                if (tabs.has(data?.message?.id)) {
                    if (data?.message?.id === this.state.currOpenTab) {
                        this.setState({ currOpenTab: -1 }, () => {
                            tabs.delete(data?.message?.id);
                        })
                    }
                }

                this.setState({ metadata: metadata, tabs: tabs });
            }
            else {
                console.log(data?.message);
            }
        })
    }

    switchCurrOpenWindow = (tabIdx) => {
        if ((!this.state.tabs.has(tabIdx)) && tabIdx !== -1) {
            const tabs = this.state.tabs;
            tabs.set(tabIdx, <Browser colorScheme={this.props.colorScheme} switchCurrOpenWindow={this.switchCurrOpenWindow} url={(this.state.metadata.get(tabIdx)).url} id={tabIdx} key={tabIdx} metadata={this.state.metadata} socket={this.props.socket} credentials={this.props?.credentials} />)
            this.setState({ tabs: tabs });
        }
        this.setState({ currOpenTab: tabIdx });
    }

    addNewTab = (url) => {
        const uniqueID = this.state.id;
        this.setState({
            id: Number(uniqueID) + 1,
            tabs: new Map([
                ...this.state.tabs,
                [uniqueID, <Browser colorScheme={this.props.colorScheme} switchCurrOpenWindow={this.switchCurrOpenWindow} url={url} id={uniqueID} key={uniqueID} metadata={this.state.metadata} socket={this.props.socket} credentials={this.props?.credentials} />]
            ])
        }, () => {
            const d = { "user_id": this.props.credentials.user_id, "device_name": this.props.tabs_data.device_name, "device_token": this.props.credentials?.device_token, "tabs_data": { [uniqueID]: { "title": "Google", "url": `https://www.google.com/` } } };
            this.props.socket.emit("add_tab", d);
            this.switchCurrOpenWindow(uniqueID);
        })
    }

    deleteAllTabs = () => {
        this.props.socket.emit("remove_all_tabs", { 'user_id': this.props.credentials.user_id, 'device_name': this.props.tabs_data.device_name, "device_token": this.props.credentials?.device_token, 'tabs_data': { 0: 'link_1_updated' } });
        this.setState({
            currOpenTab: -1,
            tabs: new Map(),
            id: 0,
            metadata: new Map(),
        })
    }

    renderTabs = () => {
        const tabs = [];
        const currOpenTab = this.state.currOpenTab
        const anim = new Animated.Value(currOpenTab === -1 ? 1 : 0)
        for (const [key, tab] of this.state.tabs) {
            const display_obj = {}
            if (this.state.currOpenTab !== key) {
                display_obj['display'] = 'none';
            }
            else {
                display_obj["transform"] = [{ scale: anim }]
            }

            tabs.push(
                <Animated.View style={{ ...styles.browser, ...display_obj }} key={key}>
                    {tab}
                </Animated.View>)
        }

        Animated.timing(
            anim,
            {
                toValue: (currOpenTab === -1 ? 0 : 1),
                duration: 300,
                useNativeDriver: true
            }
        ).start();

        return tabs
    }

    removeTab = (id) => {
        if (this.state.tabs.has(id)) {
            const newMap = this.state.tabs;
            newMap.delete(id);
            this.setState({ tabs: newMap });
        }
        if (this.state.metadata.has(id)) {
            const newMap = this.state.metadata;
            newMap.delete(id);
            this.setState({ metadata: newMap });
            this.props.socket.emit("remove_tab", { "user_id": this.props.credentials.user_id, "device_name": this.props.tabs_data.device_name, 'id': id, "device_token": this.props.credentials?.device_token });
        }
    }

    render() {
        return (
            <View>
                {this.renderTabs()}
                {this.state.currOpenTab === -1 ? <Tabs colorScheme={this.props.colorScheme} tabs={this.state.tabs} addNewTab={this.addNewTab} switchCurrOpenWindow={this.switchCurrOpenWindow} metadata={this.state.metadata} deleteAllTabs={this.deleteAllTabs} removeTab={this.removeTab} setCurrentDeviceName={this.props.setCurrentDeviceName} device_name={this.props.tabs_data.device_name} device_type={this.props.tabs_data.device_type} clearTabCache={() => { this.setState({ tabs: new Map() }) }} /> : null}
            </View>
        );
    }
}

export default React.memo(DeviceManager);

const styles = StyleSheet.create({
    browser: {
        flex: 1,
        flexDirection: 'row',
    },
    display_browser: {
        display: 'block',
    },
    hide_browser: {
        display: 'hide',
    }
});