import React from 'react';
import moment from 'moment';
import { Media } from 'reactstrap';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'ownMessage' : '';
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
    <Media className={isOwnMessage(message, user)}>
        <Media className="mr-3" object src={message.user.avatar} alt="Generic placeholder image" />
        <Media body>
            <Media className="userName" heading>
                {message.user.name}
            </Media>
            {message.content} <br />
            <small className="timeStamp">{timeFromNow(message.timestamp)}</small>
        </Media>
    </Media>
);

export default Message;