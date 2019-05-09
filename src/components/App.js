import React from 'react';
import { Row, Col } from 'reactstrap';
import './App.css';
import { connect } from 'react-redux';

import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor }) => (
    <div className="container-fluid">
        <Row>
            <Col className="col-md-3 vh-full text-light p-5" style={{ backgroundColor: primaryColor }}>
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
            <Col className="col-md-3 vh-full text-light p-5"  style={{ backgroundColor: secondaryColor }}>
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
    primaryColor: state.colors.primaryColor,
    secondaryColor: state.colors.secondaryColor
})

export default connect(mapStateToProps)(App);