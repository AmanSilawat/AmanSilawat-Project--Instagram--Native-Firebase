import firebase from 'firebase';
import { USER_POST_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POST_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE } from './../constants/';

export function clearData() {
    return (dispatch) => {
        dispatch({ type: CLEAR_DATA });
    }
}

export function fetchUser() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                } else {
                    console.log('User does not exist');
                }
            })
    }
}

export function fetchUserPosts() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });

                dispatch({ type: USER_POST_STATE_CHANGE, posts });
            })
    }
}

export function fetchUserFollowing() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => doc.id);

                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });

                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i], true))
                }
            })
    }
}

// users action
export function fetchUsersData(uid, getPosts) {
    return (dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if (!found) {
            firebase
                .firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user })
                    } else {
                        console.log('User does not exist');
                    }
                })
            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    }
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const uid = snapshot.query._.C_.path.segments[1];

                    const user = getState().usersState.users.find(el => el.uid === uid);

                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                });

                for (let i = 0; i < posts.length; i++) {
                    const currentPost = posts[i];


                    dispatch(fetchUsersFollowingLikes(uid, currentPost.id))
                }
                dispatch({ type: USERS_POST_STATE_CHANGE, posts, uid });
            })
    }
}

export function fetchUsersFollowingLikes(uid, postId) {
    return (dispatch, getState) => {
        firebase
            .firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                console.log('snapshot :>> ', snapshot);
                // const postId = snapshot.ZE.path.segments[3];
                const postId = snapshot._.S_.path.segments[3];
                let currentUserLike = false;

                if (snapshot.exists) {
                    currentUserLike = true;
                }

                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });
            })
    }
}