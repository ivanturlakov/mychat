import React from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Input, Alert, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import firebase from "../../firebase";
import md5 from "md5";
import { MdFingerprint } from "react-icons/md";

class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users")
    };

    isFormValid = () => {
        let errors = [];
        let error;
    
        if (this.isFormEmpty(this.state)) {
            error = { message: "Fill in all fields" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: "Password is invalid" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return (
            !username.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        );
    };

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    };

    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user
                        .updateProfile({
                            displayName: this.state.username,
                            photoURL: `http://gravatar.com/avatar/${md5(
                                createdUser.user.email
                            )}?d=identicon`
                        })
                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                console.log("user saved");
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            this.setState({
                                errors: this.state.errors.concat(err),
                                loading: false
                            });
                        });
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
    
    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    };
    
    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName))
            ? "is-invalid"
            : "";
    };

    render() {
        const {
            username,
            email,
            password,
            passwordConfirmation,
            errors,
            loading
        } = this.state;

        return (
            <div className="d-flex align-items-center vh-full">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col className="col-md-4">
                            <h1 className="display-4 text-center mb-4"><MdFingerprint />Register</h1>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Input 
                                        type="text" 
                                        name="username" 
                                        placeholder="Name"
                                        onChange={this.handleChange}
                                        value={username}
                                    />
                                </FormGroup>
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
                                    <Input 
                                        type="password" 
                                        name="passwordConfirmation" 
                                        placeholder="Confirm Password"
                                        onChange={this.handleChange}
                                        value={passwordConfirmation}
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
                                    Have an account? <Link to="/login">Login</Link>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Register;