import { useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { StateContext } from "../state_context";

export default function ({ message = "Loading...", showActivityIndicator = true }) {
    const { colorScheme } = useContext(StateContext);

    return (
        <View style={{ padding: 20 }}>
            {showActivityIndicator &&
                (
                    <View>
                        <ActivityIndicator />
                    </View>
                )}
            <View>
                <Text style={{ textAlign: 'center', marginVertical: showActivityIndicator ? 10 : 0, color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}>
                    {message}
                </Text>
            </View>
        </View>
    )
}