import React from 'react';
import { connect } from 'react-redux';
import { setColors } from '../../actions';
import firebase from '../../firebase'
import { MdAdd } from "react-icons/md";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CirclePicker } from 'react-color';

class ColorPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            primary: '',
            secondary: '',
            user: this.props.currentUser,
            usersRef: firebase.database().ref('users'),
            userColors: [],
        };
    
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        if(this.state.user) {
            this.addListener(this.state.user.uid);
        }
    }

    addListener = userId => {
        let userColors = [];
        this.state.usersRef.child(`${userId}/colors`).on('child_added', snap => {
            userColors.unshift(snap.val());
            this.setState({ userColors });
        })
    }

    handleChangePrimary = color => this.setState({ primary: color.hex });

    handleChangeSecondary = color => this.setState({ secondary: color.hex });

    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary) {
            this.saveColors(this.state.primary, this.state.secondary);
        }
    }

    saveColors = (primary, secondary) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/colors`)
            .push()
            .update({
                primary,
                secondary
            })
            .then(() => {
                console.log('Colors Added');
                this.toggle();
            })
            .catch(err => console.error(err));
    }

    displayUserColors = colors => (
        colors.length > 0 && colors.map((color, i) => (
            <li 
                key={i} 
                style={{ backgroundColor: color.primary }} 
                onClick={() => this.props.setColors(color.primary, color.secondary)}
            >
                <span style={{ backgroundColor: color.secondary }}></span>
            </li>
        ))
    )
    
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    
    render() {

        const { modal, primary, secondary, userColors } = this.state;
        
        return (
            <div className="colorPanel">
                <span 
                    className="addColorSchema btn-secondary" 
                    onClick={this.toggle} 
                >
                    <MdAdd />
                </span>
                <ul className="colorSchema">
                    {this.displayUserColors(userColors)}
                </ul>
                <Modal isOpen={modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Choose Colors</ModalHeader>
                    <ModalBody>
                        <h6>Primary Color</h6>
                        <CirclePicker color={primary} onChange={this.handleChangePrimary} />
                        <h6 className="mt-3">Secondary Color</h6>
                        <CirclePicker color={secondary} onChange={this.handleChangeSecondary} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="info" onClick={this.handleSaveColors}>Save Colors</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { setColors })(ColorPanel);