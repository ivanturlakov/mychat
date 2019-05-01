import React from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Input, Alert, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import firebase from "../../firebase";
import { MdFingerprint } from "react-icons/md";

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                });
        }
    };

    isFormValid = ({ email, password }) => email && password;
    
    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName))
            ? "is-invalid"
            : "";
    };

    render() {
        const {
            email,
            password,
            errors,
            loading
        } = this.state;

        return (
            <div className="d-flex align-items-center vh-full">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col className="col-md-4">
                            <h1 className="display-4 text-center mb-4"><MdFingerprint />Login</h1>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Email"
                                        onChange={this.handleChange}
                                        value={email}
                                        className={this.handleInputError(errors, "email")} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Password"
                                        onChange={this.handleChange}
                                        value={password}
                                        className={this.handleInputError(errors, "password")} 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button 
                                        type="submit" 
                                        className="btn-success btn-block" 
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner size="sm"/> : 'Submit'}
                                        
                                    </Button>
                                </FormGroup>
                                <FormGroup>
                                {errors.length > 0 && (
                                    <Alert color="danger">
                                        {this.displayErrors(errors)}
                                    </Alert>
                                )}
                                </FormGroup>
                                <FormGroup className="text-center">
                                    Don't have an account? <Link to="/register">Register</Link>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Login;