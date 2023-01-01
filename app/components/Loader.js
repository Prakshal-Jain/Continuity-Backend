import { useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { StateContext } from "../state_context";

export default function ({ message = "Loading..." }) {
    const { colorScheme } = useContext(StateContext);
    
    return (
        <View style={{ padding: 20 }}>
            <View>
                <ActivityIndicator />
            </View>
            <View>
                <Text style={{ marginTop: 10, textAlign: 'center', marginVertical: 10, color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}>
                    {message}
                </Text>
            </View>
        </View>
    )
}