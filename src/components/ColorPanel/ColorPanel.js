import React from 'react';
import { MdAdd } from "react-icons/md";

class ColorPanel extends React.Component {
    render() {
        return (
            <div className="colorPanel">
                <span className="addColorSchema btn-secondary"><MdAdd /></span>
                <ul className="colorSchema">
                    <li className="btn-secondary">1</li>
                    <li className="btn-secondary">2</li>
                    <li className="btn-secondary">3</li>
                </ul>
            </div>
        )
    }
}

export default ColorPanel;