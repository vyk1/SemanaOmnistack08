import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-community/async-storage";

import { Platform, KeyboardAvoidingView, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';

import logo from '../assets/logo.png'

import api from '../services/api'

export default function Login({ navigation }) {
    const [user, setUser] = useState('');

    //use effect significa que quando o user for 
    // modificado (apagado)
    // roda função
    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', { user })
            }
        })
    }, []);

    async function handleLogin() {
        const response = await api.post('/devs', { username: user });

        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', { _id })
    }

    return (
        <KeyboardAvoidingView
            behavior='padding'
            enabled={Platform.OS === 'ios'}
            style={styles.container}>
            <Image source={logo}></Image>
            <TextInput placeholder="Digite seu user do git"
                placeholderTextColor="#999"
                autoCapitalize='none'
                // autocapitalize none
                // para desativar a função de tornar
                // a primeira letra maíuscula
                autoCorrect={false}
                // desativar autocorretor :O
                style={styles.input}
                value={user}
                onChangeText={setUser}
            ></TextInput>
            <TouchableOpacity onPress={handleLogin} style={styles.btn}>
                <Text style={styles.btnTxt}>Enviar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    btn: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})