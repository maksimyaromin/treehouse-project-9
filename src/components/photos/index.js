import React from "react";
import Photo from "./photo";
import PropTypes from "prop-types";
import { Photo as PhotoModel } from "../../models/source";

/* Компонент с контейнером для фотографий */
const Photos = (props) => {
    const images = props.source.map((image, index) => 
        <Photo key={image.id + index} image={image} />);
    return (
        <ul className="images-list">{images}</ul>
    );
};
Photos.propTypes = {
    source: PropTypes.arrayOf(PropTypes.instanceOf(PhotoModel)).isRequired
};

export default Photos;