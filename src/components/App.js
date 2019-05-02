import React from 'react';
import { Row, Col } from 'reactstrap';
import './App.css';
import { connect } from 'react-redux';

import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser }) => (
    <div className="container-fluid">
        <Row>
            <Col className="col-md-3 vh-full bg-info text-light p-5">
                <SidePanel currentUser={currentUser}/>
            </Col>
            <Col className="col-md-6 vh-full bg-light text-dark">
                <Messages />
            </Col>
            <Col className="col-md-3 vh-full bg-secondary text-light p-5">
                <MetaPanel />
            </Col>
        </Row>
    </div>
)

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(App);