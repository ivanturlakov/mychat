import React from 'react';
import firebase from '../../firebase';
import { Media } from 'reactstrap';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if(channel && user) {
            this.addListeners(channel.id)
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        const loadedMessages = [];

        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    render() {
        const { messagesRef, messages, channel, user } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader />
                <div className="messagesArea">
                    {this.displayMessages(messages)}
                    {/* <Media className="mb-5">
                        <Media className="mr-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                    </Media>
                    <Media className="mb-5">
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                        <Media className="ml-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                    </Media>
                    <Media className="mb-5">
                        <Media className="mr-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                    </Media>
                    <Media className="mb-5">
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                        <Media className="ml-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                    </Media>
                    <Media className="mb-5">
                        <Media className="mr-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                    </Media>
                    <Media className="mb-5">
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                        <Media className="ml-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                    </Media>
                    <Media className="mb-5">
                        <Media className="mr-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                    </Media>
                    <Media className="mb-5">
                        <Media body>
                            <Media heading>
                                Media heading
                            </Media>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </Media>
                        <Media className="ml-3" object src="http://gravatar.com/avatar/918c55c269477df31aee57445c0b5df1?d=identicon" alt="Generic placeholder image" />
                    </Media> */}
                </div>
                <MessagesForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user} 
                />
            </React.Fragment>
        )
    }
}

export default Messages;