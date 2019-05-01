import React from 'react';
import { Row, Col } from 'reactstrap';
import './App.css';

import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = () => (
    <div className="container-fluid">
        <Row>
            <Col className="col-md-3 vh-full bg-info text-light p-5">
                <SidePanel />
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

export default App;