import React, { useState } from 'react';
import { Text, StyleSheet, Button, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function (props) {
    const menuAnimation = new Animated.Value(500);
    const opacityAnimation = new Animated.Value(0);
    const [show, setShow] = useState(false);

    const colorScheme = 'dark';


    const styles = StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 500,
            zIndex: 1000,
            borderTopStartRadius: 10,
            borderTopEndRadius: 10
        },
        gradient: {
            padding: 15,
            flex: 1,
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
        }
    })

    const toggleShow = () => {
        Animated.parallel([
            Animated.timing(menuAnimation, {
                toValue: (show ? 500 : 0),
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(opacityAnimation, {
                toValue: (show ? 0 : 1),
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            setShow(!show);
        });
    }

    return (
        <>
            <Button title="Show" onPress={() => toggleShow()} />
            <Animated.View style={[styles.container, { transform: [{ translateY: menuAnimation }], opacity: opacityAnimation }]}>
                <LinearGradient
                    // Button Linear Gradient
                    colors={[(colorScheme === 'dark') ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)', (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)']}
                    style={styles.gradient}
                >
                    <Button title="Hide" onPress={toggleShow} />
                    <Text>Yooo</Text>
                </LinearGradient>
            </Animated.View>
        </>
    )
};