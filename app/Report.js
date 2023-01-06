import { useContext, useRef } from "react";
import {
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    View,
    TextInput,
} from "react-native";
import { StateContext } from "./state_context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

const Report = () => {
    const { colorScheme } = useContext(StateContext);

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: (colorScheme === 'dark') ? 'rgba(28, 28, 30, 1)' : 'rgba(242, 242, 247, 1)',
            padding: 10,
        },

        scrollContainer: {
            flex: 1,
            padding: 10,
        },

        text_style: {
            color: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            margin: 10,
            fontSize: 15,
        },

        extra_description: {
            color: colorScheme === 'dark' ? 'rgba(174, 174, 178, 1)' : 'rgba(99, 99, 102, 1)',
            margin: 10,
            fontSize: 15
        },

        heading: {
            textAlign: "center",
            fontWeight: 'bold',
            fontSize: 30,
            color: colorScheme === 'dark' ? '#fff' : '#000',
            padding: 10,
        },
    });

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar animated={true}
                barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
            />
            <KeyboardAwareScrollView style={styles.scrollContainer} enableAutomaticScroll={true}>
                <Text style={styles.heading}>Report</Text>
                <Text style={styles.extra_description}>Our mighty team strive to deliver the best possible experience for our valued customers. We sincerely apologize for any inconvenience you may have encountered and want to assure you that we are dedicated to addressing and resolving any issues you may have. Your satisfaction is important to us and we highly value your feedback. Rest assured, our team will work diligently to resolve your issue and ensure a positive experience for you in the future.</Text>

                <Text style={styles.text_style}>Please use the textbox provided to let us know about your experience and click the Send button.</Text>

                <View style={{ padding: 15 }}>
                    <TextInput
                        onChangeText={() => { }}
                        style={{ flex: 1, color: '#000', paddingTop: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'rgba(242, 242, 247, 1)', borderRadius: 10, borderWidth: 1, borderColor: colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)' }}
                        returnKeyType="return"
                        placeholder="Add your feedback here..."
                        placeholderTextColor="rgba(142, 142, 147, 1)"
                        multiline={true}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default Report;