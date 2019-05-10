import React from 'react';
import firebase from "../../firebase";
import AvatarEditor from 'react-avatar-editor';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, FormGroup } from 'reactstrap';

class UserPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          dropdownOpen: false,
          modalOpen: false,
          user: this.props.currentUser,
          previewImage: '',
          croppedImage: '',
          uploadedCroppedImage: '',
          blob: '',
          storageRef: firebase.storage().ref(),
          userRef: firebase.auth().currentUser,
          usersRef: firebase.database().ref('users'),
          metadata: {
              contentType: 'image/jpeg'
          }
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    };
    
    toggleDropdown() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };

    toggleModal() {
        this.setState(prevState => ({
            modalOpen: !prevState.modalOpen
        }));
    };

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signed out!"));
    };

    handleChange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if(file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result });
            });
        }
    };

    handleCropImage = () => {
        if(this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                });
            });
        }
    };

    uploadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state;

        storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({ uploadedCroppedImage: downloadURL }, () => 
                        this.changeAvatar()) 
                })
            })
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('PhotoURL updated');
                this.toggleModal();
            })
            .catch(err => {
                console.error(err);
            });

        this.state.usersRef
            .child(this.state.user.uid)
            .update({
                avatar: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('User Avatar updated')
            })
            .catch(err => {
                console.error(err);
            });    
    }

    render() {
        const { user, dropdownOpen, modalOpen, previewImage, croppedImage } = this.state;

        return (
            <React.Fragment>
                <Dropdown className="mb-5" isOpen={dropdownOpen} toggle={this.toggleDropdown} size="lg" color="light">
                    <DropdownToggle className="bg-transparent border-0 shadow-none" caret>
                        <img src={user.photoURL} className="userPanelImg" alt="User Avatar" />
                        {user.displayName}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Signed in as {user.displayName}</DropdownItem>
                        <DropdownItem onClick={this.toggleModal}>Change Avatar</DropdownItem>
                        <DropdownItem onClick={this.handleSignout}>Log Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Modal isOpen={modalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Change Avatar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <CustomInput onChange={this.handleChange} type="file" id="avatarImage" name="customFile" label="Yo, pick a file!" />
                        </FormGroup>
                        <Row>
                            <Col className="col-6 text-left">
                                {previewImage && (
                                    <AvatarEditor
                                        ref={node => (this.avatarEditor = node)}
                                        image={previewImage}
                                        width={150}
                                        height={150}
                                        border={20}
                                        scale={1.2}
                                    />
                                )}
                            </Col>
                            <Col className="col-6 text-right">
                                {croppedImage && (
                                    <img src={croppedImage} alt="New Avatar" width="190" height="190"/>
                                )}
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {croppedImage && (
                            <Button color="info" onClick={this.uploadCroppedImage}>Change Avatar</Button>
                        )}
                        <Button color="info" onClick={this.handleCropImage}>Preview</Button>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default UserPanel;