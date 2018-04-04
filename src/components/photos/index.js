import React from "react";
import Photo from "./photo";

const Photos = (props) => {
    const images = props.source.images.map(image => 
        <Photo key={image.id} image={image} />);
    return (
        <div>{images}</div>
    );
};

export default Photos;