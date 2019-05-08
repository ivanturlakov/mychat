import React from 'react';
import { MdChatBubbleOutline } from "react-icons/md";

import UserPanel from './UserPanel';
import Channels from './Channels';
import Starred from './Starred';
import DirectMessages from './DirectMessages';
// import ColorPanel from '../ColorPanel/ColorPanel';

class SidePanel extends React.Component {
    render() {
        const { currentUser } = this.props;

        return (
            <div className="position-relative">
                <h1 className="mb-5"><MdChatBubbleOutline /> DevChat</h1>
                <UserPanel currentUser={currentUser} />
                <Starred currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
                {/* <ColorPanel /> */}
            </div>
        )
    }
}

export default SidePanel;