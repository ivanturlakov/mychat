import React from 'react';
import firebase from '../../firebase';
import { Input, Button } from 'reactstrap';
import { MdAdd, MdSend, MdAttachFile } from "react-icons/md";

class MessagesForm extends React.Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        return message
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if(message) {
            this.setState({ loading: true });
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'No messages found... Add a message!' })
            })
        }
    }

    render() {
        const { errors, message, loading } = this.state;

        return (
            <div className="messagesForm p-5">
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text"><MdAdd /></div>
                    </div>
                    <Input 
                        type="textarea" 
                        resize="false" 
                        name="message" 
                        placeholder="Add message..."
                        value={message}
                        disabled={loading}
                        className={
                            errors.some(error => error.message.includes('message'))
                            ? "is-invalid"
                            : ""
                        }
                        onChange={this.handleChange} 
                    />
                </div>
                <div className="clearfix"></div>
                <Button 
                    color="info" 
                    size="lg"
                    onClick={this.sendMessage}
                >Send <MdSend /></Button>
                <Button color="secondary" size="lg" className="float-right"><MdAttachFile /> Attach File</Button>
            </div>
        )
    }
}

export default MessagesForm;