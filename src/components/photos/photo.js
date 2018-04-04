import React from "react";

const Photo = ({ image }) => {
    return (
        <li>
            <img src={image.link} alt={image.title} />
        </li>
    );
};

export default Photo;