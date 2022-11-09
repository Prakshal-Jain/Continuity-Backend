import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Login(props) {
    const [selected, setSelected] = useState(null);

    const onSelect = (id) => {
        props.onSelect(id);
        setSelected(id);
    }

    return (
        <View style={styles.list_container}>
            {props.check_list.map(({ id, label }) => (
                <TouchableOpacity key={id} style={selected === id ? styles.selected_box : styles.list_box} onPress={() => onSelect(id)}>
                    <Text style={{color: selected === id ? 'white' : 'black'}}>
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    list_container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },

    list_box: {
        borderWidth: 1,
        borderColor: '#28282B',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },

    selected_box: {
        borderWidth: 1,
        borderColor: '#28282B',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#28282B'
    }
})