import React from 'react';
import { Row, Col } from 'reactstrap';
import './App.css';
import { connect } from 'react-redux';

import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts }) => (
    <div className="container-fluid">
        <Row>
            <Col className="col-md-3 vh-full bg-info text-light p-5">
                <SidePanel 
                    key={currentUser && currentUser.id}
                    currentUser={currentUser}
                />
            </Col>
            <Col className="col-md-6 vh-full bg-light text-dark p-5">
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    currentUser={currentUser}
                    isPrivateChannel={isPrivateChannel} 
                />
            </Col>
            <Col className="col-md-3 vh-full bg-secondary text-light p-5">
                <MetaPanel 
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    isPrivateChannel={isPrivateChannel}
                    userPosts={userPosts} 
                />
            </Col>
        </Row>
    </div>
)

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    userPosts: state.channel.userPosts,
})

export default connect(mapStateToProps)(App);