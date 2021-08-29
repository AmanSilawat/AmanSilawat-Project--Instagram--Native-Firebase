import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function Add({ navigation }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [camera, setCamera] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [image, setImage] = useState(null)

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            console.log('Platform :>> ', Platform);

            if (Platform.OS !== 'web') {
                const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                setHasGalleryPermission(galleryStatus.status !== 'granted')
            } else {
                setHasGalleryPermission(true);
            }
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    if (hasCameraPermission === null || hasGalleryPermission == null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission == false) {
        console.log('hasCameraPermission :>> ', hasCameraPermission);
        console.log('hasGalleryPermission :>> ', hasGalleryPermission);
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{ flex: 1 }} >
            <View style={styles.cameraContainer} >
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRation}
                    type={type}
                    ratio={'1:1'}
                />
            </View>
            <Button
                title="Flip Image"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
                <Text style={styles.text}> Flip </Text>
            </Button>

            <Button title="Take Picture" onPress={takePicture} />
            <Button title="Pick Image From Gallery" onPress={pickImage} />
            <Button title="Save " onPress={() => navigation.navigate('Save', { image })} />

            {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRation: {
        flex: 1,
        aspectRatio: 1,
    }
});