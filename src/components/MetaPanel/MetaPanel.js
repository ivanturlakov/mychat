import React from 'react';
import { MdInfoOutline, MdFace, MdCreate } from "react-icons/md";
import { Badge } from 'reactstrap';

class MetaPanel extends React.Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        channel: this.props.currentChannel,
    }

    formatCount = num => (num > 1 || num === 0) ? `${num} posts` : `${num} post`;

    displayTopPosters = posts => 
        Object.entries(posts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, val], i) => (
                <li key={i} className="mb-1">
                    {key} <Badge pill color="info">{this.formatCount(val.count)}</Badge>
                    {/* <img src={val.avatar} alt="Poster" width="30" className="mr-1 rounded-circle"/>  */}
                </li>
            ))
            .slice(0, 3);
    

    render() {
        const { privateChannel, channel } = this.state;
        const { userPosts } = this.props;

        if(privateChannel || !channel) return null;

        return (
            <React.Fragment>
                <h3 className="mb-5">About #{channel.name}</h3>
                <h5><MdInfoOutline /> Channel details</h5>
                <p className="ml-4">{channel.details}</p>
                <h5 className="mt-4"><MdFace /> Top Posters</h5>
                <ul className="ml-4 topPosters">
                    {userPosts && this.displayTopPosters(userPosts)}
                </ul>
                <h5 className="mt-4"><MdCreate /> Created By</h5>
                <p className="ml-4"><img src={channel.createdBy.avatar} alt="Created By" width="30" className="mr-1 rounded-circle"/> {channel.createdBy.name}</p>
            </React.Fragment>
        )
    }
}

export default MetaPanel;