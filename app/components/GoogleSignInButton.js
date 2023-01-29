import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import google from "../assets/google.png";
import CustomText from './CustomText';

const GoogleSignInButton = ({ colorScheme, ...props }) => {
    const styles = StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            backgroundColor: colorScheme === 'dark' ? 'rgba(242, 242, 247, 1)' : 'rgba(28, 28, 30, 1)',
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderRadius: 8,
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        logo: {
            width: 30,
            height: 30,
            marginRight: 12,
            resizeMode: 'contain',
        },
        buttonText: {
            color: colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)',
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
        },
    });


    return (
        <TouchableOpacity {...props} style={styles.button}>
            <Image
                source={google}
                style={styles.logo}
            />
            <CustomText style={styles.buttonText}>Sign in with Google</CustomText>
        </TouchableOpacity>
    );
};

export default GoogleSignInButton;
