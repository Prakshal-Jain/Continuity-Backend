import { Text, View, StyleSheet, TextInput, Image, Button, Appearance, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import CheckBoxList from './components/CheckBoxList';
import logoDark from "./assets/logo-dark.png";
import logoLight from "./assets/logo-light.png";
import GoogleSignInButton from './components/GoogleSignInButton';
import { StateContext } from "./state_context";

WebBrowser.maybeCompleteAuthSession();

export default function Login(props) {
    const { socket, colorScheme } = useContext(StateContext);
    const [deviceName, setDeviceName] = React.useState(null);
    const [selected, setSelected] = React.useState('mobile-phone');

    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "934339026423-698c5rptdnkdrr1mfog4og13naph71o1.apps.googleusercontent.com",
        iosClientId: "934339026423-o22n4psf53vs2a759e4v2233cordkg6q.apps.googleusercontent.com",
        androidClientId: "934339026423-gsjgka37gp62e5uevccgsqd0o7m8s907.apps.googleusercontent.com"
    });

    useEffect(() => {
        if (response?.type === "success") {
            setAccessToken(response.authentication.accessToken);
            accessToken && fetchUserInformation();
        }
    }, [response, accessToken])

    const postCredentials = (creds) => {
        creds.user_id = creds?.email;
        socket.emit("login", creds);
    }

    const fetchUserInformation = async () => {
        const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userInfo = await response.json();
        setUser(userInfo);
    }

    const data = [
        { id: 'mobile-phone', label: 'Mobile Phone' },
        { id: 'tablet', label: 'Tablet' },
        { id: 'laptop', label: 'Laptop' },
        { id: 'desktop', label: 'Desktop' },
    ];


    const styles = StyleSheet.create({
        horizontal_flex: {
            flexDirection: 'row',
            width: '100%',
            paddingVertical: 15,
        },
        text_input: {
            borderWidth: 1,
            padding: 15,
            flex: 1,
            borderRadius: 8,
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            borderColor: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
        },
        container: {
            padding: 20,
            flex: 1,
            width: '100%',
        },
        h1: {
            fontWeight: 'bold',
            fontSize: 40,
        },
        get h2() {
            return {
                marginTop: 10,
                fontWeight: 'bold',
                fontSize: 25,
                color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            }
        },
        get privacy() {
            return {
                color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            }
        },
        loginScreenButton: {
            marginRight: 40,
            marginLeft: 40,
            marginTop: 10,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: 'rgba(10, 132, 255, 1)',
            borderRadius: 10,
        },
        loginText: {
            color: '#fff',
            textAlign: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 20,
            fontWeight: 'bold'
        }
    });




    return (
        <View style={{ flex: 1, width: '100%' }}>
            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={colorScheme === 'dark' ? logoLight : logoDark} style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 }} />
                {user === null ? (
                    <GoogleSignInButton
                        // onPress={() => promptAsync()}
                        onPress={() => setUser({ "email": "prashaljain42@gail.com", "family_name": "Jain", "given_name": "prakshal", "id": "108536725217798960329", "locale": "en", "name": "prakshal Jain", "picture": "https://lh3.googleusercontent.com/a/AEdFTp46EBCoVhTqDq7Nb_9C79dOLPFqb1bxJ4g-B9RAyQ=s96-c", "verified_email": true })}
                        colorScheme={colorScheme}
                    />
                )
                    :
                    (
                        <>
                            <View style={styles.horizontal_flex}>
                                <TextInput style={styles.text_input} placeholder="Device Name" placeholderTextColor={colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} onChangeText={setDeviceName} />
                            </View>

                            <Text style={styles.h2}>Device Type</Text>
                            <View style={styles.horizontal_flex}>
                                <CheckBoxList check_list={data} onSelect={setSelected} selected={selected} default={data[0]} colorScheme={colorScheme} />
                            </View>

                            <TouchableOpacity
                                style={styles.loginScreenButton}
                                onPress={() => { postCredentials({ 'device_name': deviceName, ...user, 'device_type': selected }) }}
                                underlayColor='#fff'>
                                <Text style={styles.loginText}>Get Started</Text>
                            </TouchableOpacity>
                        </>
                    )
                }

            </ScrollView>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }} onPress={() => props.navigation.navigate('Privacy Policy')}>
                <Text style={styles.privacy}>
                    Privacy Policy
                </Text>
            </TouchableOpacity>
        </View>
    );
}