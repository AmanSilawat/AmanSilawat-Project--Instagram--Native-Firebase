import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
// import 'firebase/firebase-storage';

function Feed(props) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let posts = [];
        if (props.usersLoaded == props.following.length) {
            for (let i = 0; i < props.following.length; i++) {
                const user = props.users.find(el => el.uid === props.following[i]);
                if (user != undefined) {
                    posts = [...posts, ...user.posts]
                }
            }

            posts.sort((x, y) => x.creation - y.creation);
            setPosts(posts);
        }
    }, [props.usersLoaded])

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
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
        flex: 1,
    },
    containerImage: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        height: 500

    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    usersLoaded: store.usersState.usersLoaded
})


export default connect(mapStateToProps, null)(Feed);