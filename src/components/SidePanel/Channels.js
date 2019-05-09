import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { ListGroup, ListGroupItem, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input } from 'reactstrap';
import { MdAddCircleOutline } from "react-icons/md";
import { MdDvr } from "react-icons/md";

class Channels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.currentUser,
            activeChannel: '',
            channel: null,
            channels: [],
            channelName: '',
            channelDetails: '',
            channelsRef: firebase.database().ref('channels'),
            messagesRef: firebase.database().ref('messages'),
            notifications: [],
            modal: false,
            firstLoad: true
        };
    
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            this.addNotificationListener(snap.key);
        })
    }

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value',  snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        })
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId );

        if(index !== -1) {
            if(channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0,
            })
        }
        this.setState({ notifications });
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            this.setState({ channel: firstChannel });
        }
        this.setState({ firstLoad: false })
    }
    
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    displayChannels = channels => 
        channels.length > 0 && 
        channels.map(channel => (
            <ListGroupItem 
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                className="border-0 bg-transparent list-group-item d-flex justify-content-between align-items-center"
                active={this.state.activeChannel === channel.id}
            >
                # {channel.name}
                {this.getNotificationCount(channel) && (
                    <Badge pill>{this.getNotificationCount(channel)}</Badge>
                )}
            </ListGroupItem>
        ));

    getNotificationCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
                count = notification.count;
            }
        });

        if(count > 0) return count;
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notification: updatedNotifications });
        }
    }
    
    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL

            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                this.toggle();
                console.log('channel added')
            })
            .catch(err => {
                console.log(err)
            })

    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel();
        }
        
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    render() {
        const { channels } = this.state;

        return (
            <React.Fragment>
                <h5 className="mt-5">
                    <MdDvr /> CHANNELS({ channels.length }) <span className="addChannelBtn float-right" onClick={this.toggle}><MdAddCircleOutline /></span>
                </h5>
                <ListGroup className="bg-transparent text-white channels-list">
                    {this.displayChannels(channels)}
                </ListGroup>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add a Channel</ModalHeader>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalBody>
                            <FormGroup>
                                <Input 
                                    type="text" 
                                    name="channelName" 
                                    placeholder="Name of Channel"
                                    onChange={this.handleChange} 
                                />
                            </FormGroup>
                            <FormGroup>
                                <Input 
                                    type="text" 
                                    name="channelDetails"
                                    placeholder="About the Channel"
                                    onChange={this.handleChange} 
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="info" onClick={this.handleSubmit}>Add</Button>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(
    null, 
    { setCurrentChannel, setPrivateChannel }
)(Channels);