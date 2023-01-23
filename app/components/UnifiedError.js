import { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { StateContext } from "../state_context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/*
    error?.type = message | warning | error,   (optional)
    message = JSX element | string
*/

export default function UnifiedError({ currentPage = null }) {
    const { colorScheme, error, setError } = useContext(StateContext);


    if (currentPage === null || error === null || error === undefined || (!error?.displayPages?.has(currentPage))) {
        return null;
    }

    const iconMap = {
        message: { icon: "bell-badge-outline", color: (colorScheme === 'dark') ? 'rgba(10, 132, 255, 1)' : 'rgba(0, 122, 255, 1)' },
        warning: { icon: "alert-outline", color: (colorScheme === 'dark') ? 'rgba(255, 214, 10, 1)' : 'rgba(255, 149, 0, 1)' },
        error: { icon: "alert-circle", color: (colorScheme === 'dark') ? 'rgba(255, 69, 58, 1)' : 'rgba(255, 59, 48, 1)' },
    }

    const bgColors = {
        message: (colorScheme === 'dark') ? 'rgba(10, 132, 255, 0.3)' : 'rgba(0, 122, 255, 0.3)',
        warning: (colorScheme === 'dark') ? 'rgba(255, 214, 10, 0.3)' : 'rgba(255, 149, 0, 0.3)',
        error: (colorScheme === 'dark') ? 'rgba(255, 69, 58, 0.3)' : 'rgba(255, 59, 48, 0.3)',
    }

    const styles = StyleSheet.create({
        alertContainer: {
            margin: 15,
            backgroundColor: bgColors[error?.type],
            borderWidth: 1,
            borderColor: iconMap[error?.type].color,
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
        },

        iconStyle: {
            color: iconMap[error?.type].color,
            marginRight: 10,
            fontSize: 25
        },

        textStyle: {
            color: (colorScheme === 'dark') ? '#fff' : '#000',
            fontWeight: (error?.type === "message" ? undefined : "bold"),
            flex: 1,
            marginRight: 10
        },

        closeIcon: {
            fontSize: 20,
            color: (colorScheme === 'dark') ? '#fff' : '#000',
        }
    })


    return (
        <View style={styles.alertContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name={iconMap[error?.type].icon} style={styles.iconStyle} color={iconMap[error?.type]?.color} />
                <Text style={styles.textStyle}>{error?.message}</Text>
                <MaterialCommunityIcons name="close" style={styles.closeIcon} onPress={() => setError(null)} />
            </View>
        </View>
    )
}