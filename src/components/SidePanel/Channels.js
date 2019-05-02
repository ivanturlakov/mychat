import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';
import { ListGroup, ListGroupItem, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input } from 'reactstrap';
import { MdAddCircleOutline } from "react-icons/md";
import { MdDvr } from "react-icons/md";

class Channels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.currentUser,
            activeChannel: '',
            channels: [],
            channelName: '',
            channelDetails: '',
            channelsRef: firebase.database().ref('channels'),
            modal: false,
            firstLoad: true
        };
    
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
        })
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
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
                className="border-0 bg-info list-group-item d-flex justify-content-between align-items-center"
                active={this.state.activeChannel === channel.id}
            >
                # {channel.name} <Badge pill>14</Badge>
            </ListGroupItem>
        ))

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
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
                <h5>
                    <MdDvr /> CHANNELS({ channels.length }) <span className="addChannelBtn float-right" onClick={this.toggle}><MdAddCircleOutline /></span>
                </h5>
                <ListGroup className="bg-info text-white channels-list">
                    {/* <ListGroupItem className="border-0 bg-info list-group-item d-flex justify-content-between align-items-center">Cras justo odio <Badge pill>14</Badge></ListGroupItem>
                    <ListGroupItem className="border-0 bg-info list-group-item d-flex justify-content-between align-items-center">Dapibus ac facilisis in <Badge pill>2</Badge></ListGroupItem>
                    <ListGroupItem className="border-0 bg-info list-group-item d-flex justify-content-between align-items-center">Morbi leo risus <Badge pill>1</Badge></ListGroupItem> */}
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
    { setCurrentChannel }
)(Channels);