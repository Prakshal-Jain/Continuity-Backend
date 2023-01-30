import { Text, View, StyleSheet, TextInput, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import CheckBoxList from './components/CheckBoxList';
import logoDark from "./assets/logo-dark.png";
import logoLight from "./assets/logo-light.png";
import { StateContext } from "./state_context";
import UnifiedError from './components/UnifiedError';
import ProgressBar from "./components/ProgressBar";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from './components/CustomText';
import storage from "./utilities/storage";

export default function Login({ navigation, route }) {
    const { socket, colorScheme } = useContext(StateContext);
    const [deviceName, setDeviceName] = useState(null);
    const [selected, setSelected] = useState('mobile-phone');

    const [user, setUser] = useState(null);

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const [currStep, setCurrStep] = useState(1);

    const postCredentials = (creds) => {
        socket.emit("login", creds);
    }

    const data = [
        { id: 'mobile-phone', label: 'Mobile Phone' },
        { id: 'tablet', label: 'Tablet' },
        { id: 'laptop', label: 'Laptop' },
        { id: 'desktop', label: 'Desktop' },
    ];

    const clearStates = () => {
        setUser(null);
        setDeviceName(null);
        setSelected('mobile-phone');
        setCurrStep(1);
    }


    const styles = StyleSheet.create({
        root: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
        },
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
            flexWrap: 'wrap'
        },
        loginText: {
            color: '#fff',
            textAlign: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 20,
            fontWeight: 'bold',
        },
        differentEmailbtn: {
            backgroundColor: colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            borderRadius: 10,
            marginBottom: 10,
            alignSelf: 'flex-start'
        },
        differentEmailText: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            fontSize: 12,
        }
    });

    const setCreds = async () => {
        setUser({ email, user_id: email });
        setEmail(null);
        setPassword(null);
        await storage.set('password', password);
        setCurrStep(2)
    }


    return (
        <SafeAreaView style={[styles.root, { backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)' }]}>
            <ProgressBar stepCount={2} currStep={currStep} showLabel={true} />

            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                {currStep === 2 && (
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity
                            style={styles.differentEmailbtn}
                            underlayColor='#fff'
                            onPress={clearStates}
                        >
                            <FontAwesome name="angle-left" size={15} color={(colorScheme === 'dark') ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} style={{ marginRight: 6 }} />
                            <Text style={styles.differentEmailText}>Use a different email</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Image source={colorScheme === 'dark' ? logoLight : logoDark} style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 }} />
                {user === null ?
                    (
                        <>
                            <View style={styles.horizontal_flex}>
                                <TextInput
                                    style={styles.text_input}
                                    placeholder="Email"
                                    placeholderTextColor={colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'}
                                    onChangeText={setEmail}
                                    key="email"
                                />
                            </View>
                            <View style={styles.horizontal_flex}>
                                <TextInput style={styles.text_input} placeholder="Password" secureTextEntry={true} placeholderTextColor={colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} onChangeText={setPassword} />
                            </View>

                            <TouchableOpacity
                                style={styles.loginScreenButton}
                                onPress={setCreds}
                                underlayColor='#fff'>
                                <CustomText style={styles.loginText}>Sign In</CustomText>
                            </TouchableOpacity>
                        </>
                    )
                    :
                    (
                        <>
                            <View style={styles.horizontal_flex}>
                                <TextInput style={styles.text_input} placeholder="Device Name" key="device_name" placeholderTextColor={colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)'} onChangeText={setDeviceName} />
                            </View>

                            <View style={{ marginTop: 25, alignItems: 'center' }}>
                                <CustomText style={styles.h2}>Device Type</CustomText>
                                <View style={styles.horizontal_flex}>
                                    <CheckBoxList check_list={data} onSelect={setSelected} selected={selected} default={data[0]} colorScheme={colorScheme} />
                                </View>

                                <TouchableOpacity
                                    style={styles.loginScreenButton}
                                    onPress={() => { postCredentials({ 'device_name': deviceName, ...user, 'device_type': selected }) }}
                                    underlayColor='#fff'>
                                    <CustomText style={styles.loginText}>Get Started</CustomText>
                                </TouchableOpacity>
                                <View style={{ marginVertical: 20 }} />
                            </View>
                        </>
                    )
                }

                <UnifiedError currentPage={route?.name} />

            </ScrollView>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }} onPress={() => navigation.navigate('Privacy Policy')}>
                <Text style={styles.privacy}>
                    Privacy Policy
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}