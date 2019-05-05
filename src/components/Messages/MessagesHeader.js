import React from 'react';
import { Input, Badge } from 'reactstrap';
import { MdStarBorder, MdStar, MdSearch } from "react-icons/md";

class MessagesHeader extends React.Component {
    render() {
        const { handleSearchChange, channelName, numUniqueUsers } = this.props;

        return (
            <div className="mb-5">
                <span className="float-right">
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <div className="input-group-text"><MdSearch /></div>
                        </div>
                        <Input 
                            type="text" 
                            name="search" 
                            placeholder="Search messages..."
                            onChange={handleSearchChange} 
                        />
                    </div>
                </span>
                <h3>{channelName} <MdStarBorder /> <MdStar /></h3>
                <p><Badge color="secondary">{numUniqueUsers}</Badge></p>
            </div>
        )
    }
}

export default MessagesHeader;