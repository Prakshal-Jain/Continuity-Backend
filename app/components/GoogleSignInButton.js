import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import google from "../assets/google.png";

const GoogleSignInButton = ({ colorScheme, ...props }) => {
    const styles = StyleSheet.create({
        get button() {
            return {
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                backgroundColor: colorScheme === 'dark' ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)',
                padding: 12,
                borderRadius: 8,
                width: '80%',
                alignItems: 'center',
                justifyContent: 'center',
            }
        },
        logo: {
            width: 30,
            height: 30,
            marginRight: 12,
            resizeMode: 'contain'
        },
        get buttonText() {
            return {
                color: colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
    });


    return (
        <TouchableOpacity {...props} style={styles.button}>
            <Image
                source={google}
                style={styles.logo}
            />
            <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
    );
};

export default GoogleSignInButton;
