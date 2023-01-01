import { useContext, useRef, useState } from "react";
import { View, TextInput, SafeAreaView, StatusBar, StyleSheet, KeyboardAvoidingView, Animated, Keyboard, ActivityIndicator, Share, ScrollView, Text } from "react-native";
import { WebView } from "react-native-webview";
import { StateContext } from "./state_context";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { URL } from 'react-native-url-polyfill';


/*
    Params: url, incognito, target_device, injectedJavaScript
*/


const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}


const defaultURL = 'https://www.google.com/';

export default function ({ navigation, route }) {
    const { socket, colorScheme, credentials } = useContext(StateContext);
    const incognito = route?.params?.incognito ?? false;
    const source = route?.params?.url ?? (incognito ? null : defaultURL);
    const target_device = route?.params?.target_device;

    let injectedJavaScript = route?.params?.injectedJavaScript ?? `
        window.ReactNativeWebView.postMessage('injected javascript works!');
        true; // note: this is required, or you'll sometimes get silent failures   
    `;

    if (incognito) {
        injectedJavaScript += `window.navigator.doNotTrack = 1;`
    }

    const [refreshing, setRefreshing] = useState(false);
    const [url, setURLHelper] = useState(source);

    const [intermediateURL, setIntermediateURL] = useState(source);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [ultraSearchPrompt, setUltraSearchPrompt] = useState(null);
    const [isFirstRequest, setIsFirstRequest] = useState(true);

    const setURL = (u) => {
        setURLHelper(u);
        setIntermediateURL(u);
    }

    const config = {
        detectorTypes: 'all',
        allowStorage: (!incognito),
        allowJavascript: true,
        allowCookies: (!incognito),
        allowLocation: (!incognito),
        allowCaching: (!incognito),
        defaultSearchEngine: 'google'
    }

    const browserRef = useRef();

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
        },

        browserBar: {
            paddingVertical: 10,
            alignItems: 'center',
            flexDirection: 'column',
            paddingHorizontal: 15,
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
            alignItems: "center",
            backgroundColor: (colorScheme === 'dark') ? '#171717' : '#f8f8ff'
        },

        searchBox: {
            flex: 1,
            marginRight: 8,
            color: (colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)'
        },

        incognitoContainer: {
            flex: 1,
            padding: 20,
        },

        heading: {
            fontWeight: 'bold',
            fontSize: 25,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            flex: 1,
            textAlign: "center",
        },

        incognitoDescriptionContainer: {
            backgroundColor: (colorScheme === 'dark') ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            marginVertical: 20,
            padding: 15,
            width: '100%',
            borderRadius: 10,
        },

        smallText: {
            color: colorScheme === 'dark' ? 'rgba(174, 174, 178, 1)' : 'rgba(99, 99, 102, 1)',
            marginBottom: 10,
            textAlign: "center",
            fontStyle: "italic"
        },

        incognitoDescriptionText: {
            color: (colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)',
            textAlign: "center",
            marginVertical: 10
        }
    });

    const IncognitoDescription = () => (
        <ScrollView style={styles.incognitoContainer} contentContainerStyle={{ alignItems: "center" }}>
            <View style={{ marginVertical: 20 }}>
                <Icon name="incognito-circle" color={(colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)'} style={{ fontSize: 60 }} />
            </View>
            <Text style={styles.heading}>Incognito Mode</Text>
            <View style={styles.incognitoDescriptionContainer}>
                <Text style={styles.incognitoDescriptionText}>
                    Incognito mode in Continuity ensures that your browsing history for all tabs in this window remains private.
                </Text>
                <Text style={styles.incognitoDescriptionText}>
                When you close this tab, Continuity will not remember the websites you visited, your search history, cookies and site data, or any AutoFill information.
                </Text>
            </View>
            <Text style={styles.smallText}>Because your internet history deserves a little mystery.</Text>
        </ScrollView>
    )


    const onBrowserLoad = (syntheticEvent) => {
        const { canGoForward, canGoBack, title } = syntheticEvent.nativeEvent;
        const curr_url = syntheticEvent.nativeEvent?.url;
        setIsFirstRequest(true);

        // const tab_metadata = { "title": title, "url": url };
        // if (this.props.metadata.has(this.props.id) && (this.props.metadata.get(this.props.id)).url !== url) {
        //     socket?.emit("update_tab", { 'user_id': credentials?.user_id, 'device_name': credentials?.device_name, "device_token": credentials?.device_token, "target_device": this.props?.target_device, "tabs_data": { [this.props.id]: tab_metadata } })
        // }
        // this.props.metadata.set(this.props.id, tab_metadata);

        const parsedUrl = new URL(curr_url);

        if (url !== curr_url) {
            if ((!incognito) && (!(parsedUrl.hostname === 'www.google.com' && parsedUrl.pathname !== '/search'))) {
                socket?.emit('set_history', {
                    'user_id': credentials?.user_id,
                    'device_name': credentials?.device_name,
                    "device_token": credentials?.device_token,
                    target_device,
                    title,
                    url,
                })
            }

            if (parsedUrl.hostname === 'www.google.com' && parsedUrl.pathname === '/search') {
                // Extract the searched string from the q query parameter
                const prompt = parsedUrl.searchParams.get('q');
                if (prompt !== undefined && prompt !== null && ultraSearchPrompt !== prompt) {
                    // A new prompt from user
                    setUltraSearchPrompt(parsedUrl.searchParams.get('q'))
                }
            }
        }


        setCanGoBack(canGoBack);
        setCanGoForward(canGoForward);
        setURL(curr_url);
    }

    const onNavigationStateChange = (navState) => {
        setIsFirstRequest(true);
    }

    const onShouldStartLoadWithRequest = (request) => {
        if (!isFirstRequest) {
            if (!incognito) {
                const parsedUrl = new URL(request.url);
                if (!(parsedUrl.hostname === 'www.google.com' && parsedUrl.pathname === '/search')) {
                    const websiteHost = (new URL(url))?.hostname;
                    const trackerHost = parsedUrl?.hostname;
                    if (trackerHost !== null && trackerHost !== undefined && trackerHost !== '' && (!websiteHost.includes(trackerHost)) && websiteHost !== 'www.google.com' && trackerHost !== 'www.google.com') {
                        console.log(websiteHost, trackerHost);
                        socket?.emit('report_privacy_trackers', {
                            'user_id': credentials?.user_id,
                            'device_name': credentials?.device_name,
                            "device_token": credentials?.device_token,
                            target_device,
                            "website_host": websiteHost,
                            "tracker": trackerHost
                        })
                    }
                }
            }
        }
        else {
            setIsFirstRequest(false);
        }
        // can prevent requests from fulfilling, good to log requests
        // or filter ads and adult content.

        // MUST return true for the request to pass through
        return true;
    }

    const onBrowserError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent)
    };

    const onBrowserMessage = (event) => {
    }

    function upgradeURL(uri) {
        if (isValidUrl(uri)) {
            let sanitized = (sanitizeUrl(uri)).toLowerCase();
            if (sanitized.startsWith('http') || sanitized.startsWith('https')) {
                return sanitized;
            }
            else {
                return `https://${sanitized}`;
            }
        }
        else {
            return `https://www.google.com/search?q=${uri}`;
        }
    }

    const loadURL = () => {
        if (intermediateURL === null || intermediateURL === undefined || intermediateURL.length === 0) {
            setURL(defaultURL);
            Keyboard.dismiss();
        }
        else {
            const newURL = upgradeURL(intermediateURL);
            setURL(newURL);
            Keyboard.dismiss();
        }
    }

    const reload = () => {
        try {
            if (browserRef) {
                setIsFirstRequest(true);
                browserRef.current.reload();
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    const goBack = () => {
        try {
            if (browserRef?.current && canGoBack) {
                setIsFirstRequest(true);
                browserRef?.current?.goBack();
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const goForward = () => {
        try {
            if (browserRef?.current && canGoForward) {
                setIsFirstRequest(true);
                browserRef?.current?.goForward();
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: intermediateURL
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
    }

    const ultraSearchFunc = () => {
        if (credentials?.enrolled_features?.ultra_search?.enrolled === false) {
            // Change Homepage below to "Browser" --> when browser becomes a navigation screen
            return () => { navigation?.navigate('Ultra Search', { redirectScreen: 'Homepage' }) }
        }
        else {
            // Check if switch is turned on
            if (credentials?.enrolled_features?.ultra_search?.switch === false) {
                return () => { navigation?.navigate('Settings', { "action_message": "To begin using Ultra Search, please turn on the switch.", "feature_name": 'Ultra Search', "icon_type": "warning" }) }
            }
            else {
                return () => { navigation?.navigate('Ultra Search Results', { "ultra_search_prompt": ultraSearchPrompt }) };
            }
        }
    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <KeyboardAvoidingView
                {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
                style={{
                    width: "100%",
                    ...styles.root,
                }}
            >
                {(incognito && (url === null))
                    ?
                    (
                        <IncognitoDescription />
                    )
                    :
                    (
                        <WebView
                            ref={browserRef}
                            originWhitelist={['*']}
                            source={{ uri: url }}
                            onLoad={onBrowserLoad}
                            onLoadStart={() => setRefreshing(true)}
                            onLoadEnd={() => setRefreshing(false)}
                            onError={onBrowserError}
                            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                            onNavigationStateChange={onNavigationStateChange}
                            onMessage={onBrowserMessage}
                            dataDetectorTypes={config.detectorTypes}
                            thirdPartyCookiesEnabled={config.allowCookies}
                            domStorageEnabled={config.allowStorage}     // Allow webview to use localStorage and sessionStorage APIs.
                            javaScriptEnabled={config.allowJavascript}
                            geolocationEnabled={config.allowLocation}
                            cacheEnabled={config.allowCaching}
                            injectedJavaScript={injectedJavaScript}
                            pullToRefreshEnabled={true}
                            allowsBackForwardNavigationGestures={true}
                            mediaPlaybackRequiresUserAction={true}
                            onContentProcessDidTerminate={() => setURL(defaultURL)}     // Handler when webview process terminates (change the source to default page)
                        />
                    )
                }

                <Animated.View>
                    <LinearGradient
                        // Button Linear Gradient
                        colors={[(colorScheme === 'dark') ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)', (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)']}
                        style={styles.browserBar}
                    >
                        <View style={styles.layers}>
                            <Animated.View style={styles.browserAddressBar}>
                                <TextInput
                                    onChangeText={setIntermediateURL}
                                    value={intermediateURL}
                                    style={styles.searchBox}
                                    returnKeyType="search"
                                    autoCapitalize='none'
                                    onSubmitEditing={loadURL}
                                    editable={true}
                                    placeholder="Search or enter a website"
                                    placeholderTextColor={(colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)'}
                                />
                                {refreshing ? <ActivityIndicator size="small" /> : <Icon name="refresh" size={20} onPress={reload} color={(colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)'} />}
                            </Animated.View>
                        </View>

                        <View style={styles.layers}>
                            <Icon name="chevron-left" size={30} onPress={goBack} style={{ color: canGoBack ? ((colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)') : ((colorScheme === 'dark') ? 'rgba(44, 44, 46, 1)' : 'rgba(242, 242, 247, 1)') }} disabled={!canGoBack} />
                            <Icon name="export-variant" size={25} onPress={onShare} color={(colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)'} />
                            <Icon name="lightning-bolt" size={30} onPress={ultraSearchFunc()} color="rgba(255, 149, 0, 1)" />
                            <Ionicons name="ios-copy-outline" size={25} onPress={() => navigation.goBack()} color={(colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)'} />
                            <Icon name="chevron-right" size={30} onPress={goForward} style={{ color: canGoForward ? ((colorScheme === 'dark') ? 'rgba(242, 242, 247, 1)' : 'rgba(44, 44, 46, 1)') : ((colorScheme === 'dark') ? 'rgba(44, 44, 46, 1)' : 'rgba(242, 242, 247, 1)') }} disabled={!canGoForward} />
                        </View>
                    </LinearGradient>
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}