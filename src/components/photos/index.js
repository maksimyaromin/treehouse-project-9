import React from "react";
import Photo from "./photo";

const Photos = (props) => {
    const images = props.source.map((image, index) => 
        <Photo key={image.id + index} image={image} />);
    return (
        <ul className="images-list">{images}</ul>
    );
};

export default Photos;