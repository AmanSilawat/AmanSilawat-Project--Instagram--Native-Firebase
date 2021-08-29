import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase'
import "firebase/firestore";


export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this);

        var db = firebase.firestore();
        console.log('firestore__ :>> ', db);
    }

    onSignUp() {
        const { email, password, name } = this.state;

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {

                console.log('firebase :>> ', firebase);
                console.log('firebase.firestore :>> ', firebase.firestore);

                firebase
                    .firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email
                    });

                console.log('result :>> ', result);
            })
            .catch((error) => {
                console.log('error :>> ', error);
            })

    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder='name'
                    onChangeText={(name) => this.setState({ name })}
                />
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
                    title='Sign Up'
                />
            </View>
        )
    }
}

export default Register
