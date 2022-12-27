import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Keyboard,
    ActivityIndicator,
    Share,
    KeyboardAvoidingView,
    Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { URL } from 'react-native-url-polyfill';
import { StateContext } from "./state_context";

// keeps the reference to the browser
let browserRef = null;

const lodash = require('lodash');

// upgrade the url to make it easier for the user:
function upgradeURL(uri, searchEngine = 'google') {
    const isURL = uri.split(' ').length === 1 && uri.includes('.');
    if (isURL) {
        if (!uri.startsWith('http')) {
            return 'https://www.' + uri;
        }
        return uri;
    }
}

// javascript to inject into the window
const injectedJavaScript = `
      window.ReactNativeWebView.postMessage('injected javascript works!');
      true; // note: this is required, or you'll sometimes get silent failures   
`;

class Browser extends Component {
    static contextType = StateContext;
    constructor(props) {
        super(props);
        this.browserBarRef = React.createRef(0)
        this.expandedBrowserBarAnimRef = new Animated.Value(1);
        this.browserBarOpacityAnimRef = new Animated.Value(1);
    }

    state = {
        canGoForward: false,
        canGoBack: false,
        incognito: false,
        config: {
            detectorTypes: 'all',
            allowStorage: true,
            allowJavascript: true,
            allowCookies: true,
            allowLocation: true,
            allowCaching: true,
            defaultSearchEngine: 'google'
        },
        refreshing: false,
        url: this.props.url,
        displayBrowserBar: true,
        isScrollDown: false,
        ultra_search_prompt: null
    };


    // get the configuration, this allows us to change
    // configurations for incognito mode
    get config() {
        const { incognito, config } = this.state;
        if (incognito) {
            return {
                ...config,
                allowStorage: false,
                allowCookies: false,
                allowLocation: false,
                allowCaching: false,
            }
        }
        return config;
    }

    // toggle incognito mode
    toggleIncognito = () => {
        this.setState({
            incognito: !this.state.incognito
        });
        this.reload()
    };

    // load the url from the text input
    loadURL = () => {
        this.setState({ url: this.state.url }, () => {
            const { config, url } = this.state;
            const { defaultSearchEngine } = config;
            const newURL = upgradeURL(url, defaultSearchEngine);
            this.setState({
                url: newURL,
            });
            Keyboard.dismiss();
        })
    };

    // update the text input
    updateUrlText = (text) => {
        this.setState({
            url: text
        });
    };


    // go to the next page
    goForward = lodash.throttle(() => {
        if (browserRef && this.state.canGoForward) {
            browserRef.goForward();
        }
    }, 500);

    // go back to the last page
    goBack = lodash.throttle(() => {
        if (browserRef && this.state.canGoBack) {
            browserRef.goBack();
        }
    }, 500);

    // reload the page
    reload = lodash.throttle(() => {
        if (browserRef) {
            browserRef.reload();
        }
    }, 500);

    // set the reference for the browser
    setBrowserRef = (browser) => {
        if (!browserRef) {
            browserRef = browser
        }
    };

    // called when there is an error in the browser
    onBrowserError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent)
    };

    // called when the webview is loaded
    onBrowserLoad = (syntheticEvent) => {
        const { canGoForward, canGoBack, url, title } = syntheticEvent.nativeEvent;
        this.setState({
            canGoForward,
            canGoBack,
            url
        })

        const tab_metadata = { "title": title, "url": url };
        if (this.props.metadata.has(this.props.id) && (this.props.metadata.get(this.props.id)).url !== url) {
            this?.context?.socket?.emit("update_tab", { 'user_id': this?.context?.credentials?.user_id, 'device_name': this?.context?.credentials?.device_name, "device_token": this?.context?.credentials?.device_token, "target_device": this.props?.target_device, "tabs_data": { [this.props.id]: tab_metadata } })
        }
        this.props.metadata.set(this.props.id, tab_metadata);
    };

    // called when the navigation state changes (page load)
    onNavigationStateChange = (navState) => {
        const { canGoForward, canGoBack, url } = navState;
        this.setState({
            canGoForward,
            canGoBack,
            url
        })
    };

    // can prevent requests from fulfilling, good to log requests
    // or filter ads and adult content.
    onShouldStartLoadWithRequest = (request) => {
        const parsedUrl = new URL(request.url);
        if (parsedUrl.hostname === 'www.google.com' && parsedUrl.pathname === '/search') {
            // Extract the searched string from the q query parameter
            const prompt = parsedUrl.searchParams.get('q');
            if (prompt !== undefined && prompt !== null && this.state.ultra_search_prompt !== prompt) {
                // A new prompt from user
                this.setState({ ultra_search_prompt: parsedUrl.searchParams.get('q') });
            }
        }
        return true;
    };

    // called when the browser sends a message using "window.ReactNativeWebView.postMessage"
    onBrowserMessage = (event) => {
        // console.log('*'.repeat(10));
        // console.log('Got message from the browser:', event.nativeEvent.data);
        // console.log('*'.repeat(10));
    };

    onShare = async () => {
        try {
            const result = await Share.share({
                message: this.state.url
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
    };

    showTabs = () => {
        this.props.switchCurrOpenWindow(-1);
    }

    handleScroll = (event) => {
        // 0 means the top of the screen, 100 would be scrolled 100px down
        const currentYPosition = event.nativeEvent.contentOffset.y;
        const oldPosition = this.browserBarRef.current;
        //  && currentYPosition > 15
        if (oldPosition < currentYPosition) {
            // console.log("Scroll Down");
            if (this.state.isScrollDown) {
                Animated.timing(this.expandedBrowserBarAnimRef, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start()
            }
            else {
                this.setState({ isScrollDown: true });
            }

            // we scrolled down
        }

        else {
            if (!this.state.isScrollDown) {
                Animated.timing(this.expandedBrowserBarAnimRef, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start()
            }
            else {
                this.setState({ isScrollDown: false });
            }

            // we scrolled up
        }
        // save the current position for the next onScroll event
        this.browserBarRef.current = currentYPosition
    }

    render() {
        const { config, state } = this;
        const { url, canGoForward, canGoBack, incognito } = state;
        return (
            <KeyboardAvoidingView
                {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
                style={{
                    width: "100%",
                    ...styles.root,
                }}
            >
                <View style={styles.browserContainer}>
                    <WebView
                        ref={this.setBrowserRef}
                        originWhitelist={['*']}
                        source={{ uri: url }}
                        onLoad={this.onBrowserLoad}
                        onLoadStart={() => { this.setState({ refreshing: true }) }}
                        onLoadEnd={() => { this.setState({ refreshing: false }) }}
                        onError={this.onBrowserError}
                        onNavigationStateChange={this.onNavigationStateChange}
                        renderLoading={() => <ActivityIndicator size="small" color="#ffffff" />}
                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                        onMessage={this.onBrowserMessage}
                        dataDetectorTypes={config.detectorTypes}
                        thirdPartyCookiesEnabled={config.allowCookies}
                        domStorageEnabled={config.allowStorage}
                        javaScriptEnabled={config.allowJavascript}
                        geolocationEnabled={config.allowLocation}
                        cacheEnabled={config.allowCaching}
                        injectedJavaScript={injectedJavaScript}
                        pullToRefreshEnabled={true}
                        allowsBackForwardNavigationGestures={true}
                        mediaPlaybackRequiresUserAction={true}
                        style={{ backgroundColor: (this?.context?.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)', }}
                    // onScroll={this.handleScroll}
                    />
                </View>

                <Animated.View style={{ borderTopWidth: 0.5, borderTopColor: 'rgba(142, 142, 147, 1)', transform: [{ scaleY: this.expandedBrowserBarAnimRef }] }}>
                    <LinearGradient
                        // Button Linear Gradient
                        colors={[(this?.context?.colorScheme === 'dark') ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)', (this?.context?.colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)']}
                        style={styles.browserBar}
                    >
                        <View style={styles.layers}>
                            <Animated.View style={{ ...styles.browserAddressBar, backgroundColor: (this?.context?.colorScheme === 'dark') ? '#171717' : '#f8f8ff' }}>
                                <TextInput
                                    onChangeText={this.updateUrlText}
                                    value={this.state.url}
                                    style={{ ...styles.searchBox, color: (this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)' }}
                                    returnKeyType="search"
                                    onSubmitEditing={this.loadURL}
                                    editable={false}
                                    placeholderTextColor={(this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)'}
                                />
                                {this.state.refreshing ? <ActivityIndicator size="small" /> : <Icon name="refresh" size={20} onPress={this.reload} color={(this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)'} />}
                            </Animated.View>
                        </View>

                        <View style={styles.layers}>
                            <Icon name="chevron-left" size={30} onPress={this.goBack} style={{ color: canGoBack ? ((this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)') : ((this?.context?.colorScheme === 'dark') ? 'rgba(44, 44, 46, 1)' : 'rgba(242, 242, 247, 1)') }} disabled={!canGoBack} />
                            <Icon name="export-variant" size={25} onPress={this.onShare} color={(this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)'} />
                            {(this?.context?.credentials?.enrolled_features?.ultra_search?.enrolled === true && this?.context?.credentials?.enrolled_features?.ultra_search?.switch === true && this.state.ultra_search_prompt !== null) && (
                                <Icon name="lightning-bolt" size={30} onPress={() => { this.props?.navigation?.navigate('Ultra Search Results', { "ultra_search_prompt": this.state.ultra_search_prompt }) }} color="rgba(255, 149, 0, 1)" />
                            )}
                            <Icon name="checkbox-multiple-blank-outline" size={25} onPress={this.showTabs} style={{ transform: [{ rotateX: '180deg' }] }} color={(this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)'} />
                            <Icon name="chevron-right" size={30} onPress={this.goForward} style={{ color: canGoForward ? ((this?.context?.colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)') : ((this?.context?.colorScheme === 'dark') ? 'rgba(44, 44, 46, 1)' : 'rgba(242, 242, 247, 1)') }} disabled={!canGoForward} />
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* <TouchableHighlight onPress={this.toggleIncognito}>
                                <Image
                                    style={[styles.icon, incognito ? {} : styles.disabled]}
                                    source={incognitoIcon} />
                            </TouchableHighlight> */}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    browser: {
        flex: 1
    },
    root: {
        // backgroundColor: '#fff',
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    disabled: {
        opacity: 0.3
    },
    browserBar: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 15,
    },
    collapsedBrowserBar: {
        alignItems: 'center',
        flexDirection: 'column',
        padding: 15,
    },
    layers: {
        flexDirection: 'row',
        alignItems: "center",
        marginVertical: 8,
        justifyContent: "space-between",
        width: '100%',
    },
    browserAddressBar: {
        shadowColor: '#171717',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 12,
        borderWidth: 0.1,
        borderColor: '#171717',
        alignItems: "center"
    },
    searchBox: {
        flex: 1,
        marginRight: 8
    },
    browserContainer: {
        flex: 1,
    }
});

export default React.memo(Browser);