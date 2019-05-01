import React from 'react';
import { MdChatBubbleOutline } from "react-icons/md";

import UserPanel from './UserPanel';
import ColorPanel from '../ColorPanel/ColorPanel';

class SidePanel extends React.Component {
    render() {
        return (
            <div className="position-relative">
                <h2 className="mb-5"><MdChatBubbleOutline /> DevChat</h2>
                <UserPanel />
                <ColorPanel />
            </div>
        )
    }
}

export default SidePanel;