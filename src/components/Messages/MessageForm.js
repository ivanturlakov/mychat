import React from 'react';
import firebase from '../../firebase';
import mime from 'mime-types';
import uuidv4 from 'uuid/v4';
import { Button, Input, CustomInput, Spinner } from 'reactstrap';
import { MdAdd, MdSend, MdAttachFile } from "react-icons/md";

class MessageForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        if(fileUrl !== null) {
            message['image'] = fileUrl
        } else {
            message['content'] = this.state.message
        }
        return message
    }

    sendFile = event => {
        const file = event.target.files[0];
        this.setState({ file });
        
        if(file !== null) {
            if(this.isAuthorized(file.name)) {
                const metadata = { contentType: mime.lookup(file.name) };
                this.uploadFile(file, metadata);
                this.clearFile()
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    uploadFile = ( file, metadata ) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    let percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.setState({ percentUploaded });
                },
                err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null,
                    })
                },
                () => {
                    this.state.uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then(downloadURL => {
                            this.sendFileMessage(downloadURL, ref, pathToUpload);
                        })
                        .catch(err => {
                            console.error(err);
                            this.setState({
                                errors: this.state.errors.concat(err),
                                uploadState: 'error',
                                uploadTask: null,
                            })
                        })
                }
            )}
        )
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(() => {
            this.setState({ uploadState: 'done' })
        })
        .catch(err => {
            console.error(err);
            this.setState({
                loading: false,
                errors: this.state.errors.concat(err)
            })
        })
    }

    clearFile = () => this.setState({ file: null });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
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
        const { errors, message, loading, uploadState } = this.state;

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
                <span className="fileUpload">
                    {(uploadState === 'uploading')
                        ? <Spinner className="align-middle mr-3" color="info"/>
                        : ''
                    }
                    <Button 
                        color="secondary" 
                        size="lg"
                        disabled={uploadState === 'uploading'}
                    ><MdAttachFile /> Attach File
                    </Button>
                    <CustomInput 
                        type="file" 
                        id="fileInput" 
                        name="file" 
                        onChange={this.sendFile}
                        disabled={uploadState === 'uploading'}
                    />
                </span>
            </div>
        )
    }
}

export default MessageForm;