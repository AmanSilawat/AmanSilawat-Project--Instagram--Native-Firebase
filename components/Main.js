import React, { Component } from 'react'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from './../redux/actions';

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        const { currentUser } = this.props;
        console.log('currentUser :>> ', currentUser, this.props);

        if (currentUser == undefined) {
            return (
                <View>
                    <Text>user is not logged in </Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>{currentUser.name} is logged in </Text>
            </View>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToPops = (dispatch) => bindActionCreators({ fetchUser }, dispatch)

export default connect(mapStateToProps, mapDispatchToPops)(Main);
