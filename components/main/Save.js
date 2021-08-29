import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import "firebase/firebase-storage";

export default function Save(props) {
    const [caption, setCaption] = useState('');

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        console.log('childPath :>> ', childPath);

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log('snapshot.bytesTransferred :>> ', snapshot.bytesTransferred);
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
                console.log('snapshot completed :>> ', snapshot);
            })
        }

        const taskError = snapshot => {
            console.log('snapshot Error :>> ', snapshot);
        }

        task.on('state_changed', taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        console.log('downloadURL :>> ', downloadURL);
        console.log('firebase.firestore.FieldValue :>> ', firebase.firestore.FieldValue.serverTimestamp());

        const data = {
            downloadURL,
            caption,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        }

        console.log('data :>> ', data);

        firebase
            .firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .add(data)
            .then(() => {
                props.navigation.popToTop();
            })


    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder='Write a Caption...'
                onChangeText={caption => setCaption(caption)}
            />
            <Button
                title='Save'
                onPress={uploadImage}
            />
        </View>
    )
}
