import React from 'react';
import { Input, Badge } from 'reactstrap';
import { MdStarBorder, MdStar, MdSearch } from "react-icons/md";

class MessagesHeader extends React.Component {
    render() {
        return (
            <div className="mb-5">
                <span className="float-right">
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <div className="input-group-text"><MdSearch /></div>
                        </div>
                        <Input type="text" name="search" placeholder="Search messages..." />
                    </div>
                </span>
                <h3>Channel <MdStarBorder /> <MdStar /></h3>
                <p><Badge color="secondary">3</Badge> Users</p>
            </div>
        )
    }
}

export default MessagesHeader;