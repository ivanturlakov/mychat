import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { MdMailOutline, MdFiberManualRecord } from "react-icons/md";

class DirectMessages extends React.Component {
    state = {
        activeChannel: '',
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence'),
    };

    componentDidMount() {
        if(this.state.user) {
            this.addListeners(this.state.user.uid)
        }
    };

    componentWillUnmount() {
        this.removeListeners();
    };

    removeListeners = () => {
        this.state.usersRef.off();
        this.state.presenceRef.off();
        this.state.connectedRef.off();
    };

    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });

        this.state.connectedRef.on('value', snap => {
            if(snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if(err !== null) {
                        console.error(err)
                    }
                })
            }
        });

        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key)
            }
        });

        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key, false)
            }
        });
    };

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if(user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, []);
        this.setState({ users: updatedUsers })
    };

    isUserOnline = (user) => user.status === 'online';

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
        this.setActiveChannel(user.uid);
    };

    setActiveChannel = userId => {
        this.setState({ activeChannel: userId });
    };

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ?
            `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    };

    render() {
        const { users, activeChannel } = this.state;

        return (
            <React.Fragment>
                <h5 className="mt-5">
                    <MdMailOutline /> MESSAGES({ users.length })
                </h5>
                <ListGroup className="bg-transparent text-white channels-list">
                    {users.map(user => (
                        <ListGroupItem 
                            key={user.uid}
                            onClick={() => this.changeChannel(user)}
                            active={user.uid === activeChannel}
                            className="border-0 bg-transparent list-group-item d-flex justify-content-between align-items-center"
                        >
                            @ {user.name} {this.isUserOnline(user) ? <MdFiberManualRecord /> : ''}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </React.Fragment>

        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);