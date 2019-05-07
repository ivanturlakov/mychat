import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { MdStarBorder } from "react-icons/md";


class Starred extends React.Component {
    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        starredChannels: [],
        activeChannel: '',
    }

    componentDidMount() {
        if(this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = (userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() };
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                });
            });
        
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove = { id: snap.key, ...snap.val() };
                const filteredChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !== channelToRemove.id;
                });
                this.setState({ starredChannels: filteredChannels });
            })    
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    }

    displayChannels = starredChannels => 
        starredChannels.length > 0 && 
        starredChannels.map(channel => (
            <ListGroupItem 
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                className="border-0 bg-info list-group-item d-flex justify-content-between align-items-center"
                active={this.state.activeChannel === channel.id}
            >
                # {channel.name}
            </ListGroupItem>
    ));

    render() {
        const { starredChannels } = this.state;

        return (
            <React.Fragment>
                <h5>
                    <MdStarBorder /> STARRED({ starredChannels.length })
                </h5>
                <ListGroup className="bg-info text-white channels-list">
                    {this.displayChannels(starredChannels)}
                </ListGroup>
            </React.Fragment>
        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);