import React from 'react';
import firebase from "../../firebase";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class UserPanel extends React.Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            user: this.props.currentUser
        };
    }

    
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    handleSignout = () => {
        firebase
          .auth()
          .signOut()
          .then(() => console.log("signed out!"));
      };

    render() {
        const { user } = this.state;

        return (
            <Dropdown className="mb-5" isOpen={this.state.dropdownOpen} toggle={this.toggle} size="lg" color="light">
                <DropdownToggle className="btn-info" caret>
                    <img src={user.photoURL} className="userPanelImg" alt="User Avatar" />
                    {user.displayName}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Signed in as {this.state.user.displayName}</DropdownItem>
                    <DropdownItem>Change Avatar</DropdownItem>
                    <DropdownItem onClick={this.handleSignout}>Log Out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
    }
}

export default UserPanel;