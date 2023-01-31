import { Text, Platform } from "react-native"

export default function CustomText({ children, ...props }) {
    return (
        <Text {...props}>{Platform.OS === 'ios' ? '' : ' '}{children}{Platform.OS === 'ios' ? '' : ' '}</Text>
    )
}