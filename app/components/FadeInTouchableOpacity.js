import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated } from "react-native";

const FadeInTouchableOpacity = ({ style, children, onPress, ...props }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])

    return (
        <TouchableOpacity onPress={onPress}>
            <Animated.View
                {...props}
                style={{
                    ...style,
                    transform: [{ scale: fadeAnim }],
                }}
            >
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
}

export default FadeInTouchableOpacity;