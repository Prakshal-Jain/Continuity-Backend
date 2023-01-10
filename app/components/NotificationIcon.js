import { useContext, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StateContext } from "../state_context";

export default function NotificationIcon({ count = 0, size = 35 }) {
    const { colorScheme } = useContext(StateContext);
    if (typeof (count) === 'string' || typeof (count) === 'number') {
        count = parseInt(count);
        if (isNaN(count)) {
            count = 0;
        }
    }
    const countStr = (count >= 100) ? "99+" : String(count);
    const font_size = (countStr.length >= 3) ? 8 : 10;

    const anim = new Animated.Value(0);

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true
        }).start()
    }, [count])

    const styles = StyleSheet.create({
        count: {
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(255, 45, 85, 1)',
            height: 21,
            width: 21,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center"
        },
        count_text: {
            alignItems: "center",
            justifyContent: "center",
            fontSize: font_size,
            textAlign: "center",
            fontWeight: "bold",
            color: '#fff'
        }
    })

    return (
        <View>
            {(count > 0) && (
                <Animated.View style={[styles.count, { transform: [{ scale: anim }] }]} >
                    <Text style={styles.count_text}>{countStr}</Text>
                </Animated.View>
            )}
            <Ionicons name="notifications" size={size} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
    )
}