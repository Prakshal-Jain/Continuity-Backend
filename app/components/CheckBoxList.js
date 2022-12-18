import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Login(props) {
    const [selected, setSelected] = useState(null);

    const onSelect = (id) => {
        props.onSelect(id);
        setSelected(id);
    }

    const styles = StyleSheet.create({
        list_container: {
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },

        list_box: {
            borderWidth: 1,
            borderColor: props.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
            padding: 10,
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 10,
        },

        selected_box: {
            borderWidth: 1,
            padding: 10,
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 10,
            backgroundColor: props.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)',
        }
    })

    return (
        <View style={styles.list_container}>
            {props.check_list.map(({ id, label }) => (
                <TouchableOpacity key={id} style={selected === id ? styles.selected_box : styles.list_box} onPress={() => onSelect(id)}>
                    <Text style={{ color: selected === id ? (props.colorScheme === 'dark' ? 'rgba(58, 58, 60, 1)' : 'rgba(209, 209, 214, 1)') : (props.colorScheme === 'dark' ? 'rgba(209, 209, 214, 1)' : 'rgba(58, 58, 60, 1)') }}>
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}