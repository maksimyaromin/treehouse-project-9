import React from "react";
import PropTypes from "prop-types";
import { Photo as PhotoModel } from "../../models/source";

/* When you move the cursor over the photo, it will be set as the background-image for the tag header. Just for fun */
const showImage = (e) => {
    let target = e.target;
    if(target.tagName !== "IMG") {
        target = target.parentElement.getElementsByTagName("IMG")[0];
    }
    if(!target) { return; }
    const previewContext = document.querySelector(".images-header");
    previewContext.style.backgroundImage = `url(${target.src})`;
    previewContext.classList.add("images-header_active");
};

/* Delete the background-image set by the previous function */
const hideImage = (e) => {
    const previewContext = document.querySelector(".images-header");
    previewContext.style.backgroundImage = `none`;
    previewContext.classList.remove("images-header_active");
};

/* Component for displaying a photo */
const Photo = ({ image }) => {
    return (
        <li className="images-list__item">
            <div className="image-wrapper" onMouseEnter={showImage} onMouseLeave={hideImage}>
                <img className="image" src={image.link} alt={image.title} />
                <div className="image-title">
                    <span>{image.title}</span>
                </div>
            </div>
        </li>
    );
};
Photo.propTypes = {
    image: PropTypes.instanceOf(PhotoModel).isRequired
};

export default Photo;