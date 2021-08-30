import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
// import 'firebase/firebase-storage';

function Profile(props) {
    console.log('props :>> ', props);

    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        const { currentUser, posts } = props;
        console.log('props.route.params.uid :>> ', props.route.params.uid);

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts);
        } else {
            firebase
                .firestore()
                .collection('users')
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                        console.log('snapshot.data() :>> ', snapshot.data());
                    } else {
                        console.log('Profile does not exist');
                    }
                })

            firebase
                .firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .orderBy('creation', 'asc')
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    });
                    console.log('posts :>> ', posts);
                    setUserPosts(posts)
                })
        }

    }, [props.route.params.uid])

    if (user == null) {
        return <View />
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Image
                                source={{ uri: item.downloadURL }}
                                style={styles.image}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        height: 350

    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})


export default connect(mapStateToProps, null)(Profile);