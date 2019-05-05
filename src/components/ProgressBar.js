import React from 'react';
import { Progress } from 'reactstrap';

const ProgressBar = ({ uploadState, percentUploaded }) => (
    uploadState && (
        <Progress value={percentUploaded} max="100" className="progressLine"/>
    )
);

export default ProgressBar;