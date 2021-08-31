import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase';

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password } = this.state;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log('Login result :>> ', result);
            })
            .catch((error) => {
                console.log('Login error :>> ', error);
            })

    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder='email'
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    placeholder='password'
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                />

                <Button
                    onPress={() => this.onSignUp()}
                    title='Login'
                />
            </View>
        )
    }
}

export default Login;
