import React from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';

export default class Loader extends React.Component {
    render() {
        return (
            <div className="d-flex align-items-center vh-full">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col className="col-md-4 text-center">
                            <Spinner style={{ width: '10rem', height: '10rem' }} color="dark" />
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    } 
}