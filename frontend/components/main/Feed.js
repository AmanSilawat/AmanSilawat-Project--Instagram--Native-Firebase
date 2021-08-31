import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
// import 'firebase/firebase-storage';

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // let posts = [];
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            // for (let i = 0; i < props.following.length; i++) {
            //     const user = props.users.find(el => el.uid === props.following[i]);
            //     if (user != undefined) {
            //         posts = [...posts, ...user.posts]
            //     }
            // }

            props.feed.sort((x, y) => x.creation - y.creation);
            setPosts(props.feed);
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        // add current user id in likes document
        firebase
            .firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
        
        // likesCount increment by 1
        firebase
            .firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(1),
            });
    }

    const onDislikePress = (userId, postId) => {
        // delete current user id in likes document
        firebase
            .firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete({})
        
        // likesCount decrement by 1
        firebase
            .firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(-1),
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Text style={styles.container}>{item?.user?.name}</Text>
                            <Image
                                source={{ uri: item.downloadURL }}
                                style={styles.image}
                            />
                            {/* <Text
                                onPress={() => (
                                    props.navigation.navigate('Comments', {
                                        postId: item.id,
                                        uid: item.user.uid
                                    })
                                )}
                            >
                                View Comments...
                            </Text> */}

                            {item.currentUserLike
                                ? (
                                    <Button
                                        title="Dislike"
                                        onPress={() => onDislikePress(item.user.uid, item.id)}
                                    />
                                )
                                : (
                                    <Button
                                        title="Like"
                                        onPress={() => onLikePress(item.user.uid, item.id)}
                                    />
                                )
                            }

                            <Text
                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                View Comments...
                            </Text>
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
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})


export default connect(mapStateToProps, null)(Feed);