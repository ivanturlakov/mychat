import React from 'react';
import firebase from "../../firebase";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class UserPanel extends React.Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
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
        return (
            <div>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} size="lg" color="light">
                    <DropdownToggle className="btn-info" caret>
                        UserName
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Signed in as UserName</DropdownItem>
                        <DropdownItem>Change Avatar</DropdownItem>
                        <DropdownItem onClick={this.handleSignout}>Log Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        )
    }
}

export default UserPanel;