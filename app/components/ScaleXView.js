import React, { useRef, useEffect } from 'react';
import { Animated } from "react-native";

const ScaleXView = ({ style, children, deleteScaleRef, ...props }) => {
    const scaleAnim = useRef(new Animated.Value(100)).current  // Initial value for opacity: 0
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    useEffect(() => {
        Animated.parallel([
            Animated.spring(
                scaleAnim,
                {
                    toValue: 0,
                    useNativeDriver: true
                }
            ).start(),

            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true
                }
            ).start()
        ])
    }, [scaleAnim])

    return (
        <Animated.View
            {...props}
            style={{
                ...style,
                transform: [{ translateY: scaleAnim }, { scale: deleteScaleRef }],
                opacity: fadeAnim
            }}
        >
            {children}
        </Animated.View>
    );
}

export default ScaleXView;