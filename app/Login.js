import { Text, View, StyleSheet, TextInput, Image, Button, Appearance, ScrollView } from 'react-native';
import SelectList from 'react-native-dropdown-select-list'
import React from "react";
import CheckBoxList from './components/CheckBoxList'
import feather from "./assets/feather.png"

export default function Login(props) {
    const [deviceName, setDeviceName] = React.useState(null);
    const [username, setUsername] = React.useState(null);
    const [selected, setSelected] = React.useState(null);

    const data = [
        { id: 'mobile-phone', label: 'Mobile Phone' },
        { id: 'tablet', label: 'Tablet' },
        { id: 'laptop', label: 'Laptop' },
        { id: 'desktop', label: 'Desktop' },
    ];

    return (
        <View style={{flex: 1, width: '100%',}}>
            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.h1}>Continuity</Text>
                <Image source={feather} style={{ width: 150, height: 150 }} />
                <Text style={styles.h2}>Sign Up</Text>
                <View style={styles.horizontal_flex}>
                    <TextInput style={styles.text_input} placeholder="Username" placeholderTextColor="rgba(27,57,107,255)" onChangeText={setUsername} />
                </View>
                <View style={styles.horizontal_flex}>
                    <TextInput style={styles.text_input} placeholder="Device Name" placeholderTextColor="rgba(27,57,107,255)" onChangeText={setDeviceName} />
                </View>

                <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Device Type</Text>
                <View style={styles.horizontal_flex}>
                    <CheckBoxList check_list={data} onSelect={setSelected} default={data[0]} />
                </View>
                <Button style={styles.button} title="Sign Up" color='rgba(27,57,107,255)' onPress={() => { props.postCredentials({ 'device_name': deviceName, 'user_id': username, 'device_type': selected }) }} />
            </ScrollView>
            <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
                <Text>
                    Privacy Policy
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text_styles: {
        color: Appearance.getColorScheme() === 'dark' ? '#fff' : '#000',
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
        borderColor: 'rgba(27,57,107,1)',
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
    h2: {
        fontWeight: 'bold',
        fontSize: 25
    },
});

