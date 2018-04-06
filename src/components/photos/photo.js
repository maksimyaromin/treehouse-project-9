import React from "react";
import PropTypes from "prop-types";
import { Photo as PhotoModel } from "../../models/source";

/* При наведении курсора на фотографию она будет установлена в качестве background-image для шапки с тэгом. Просто по приколу */
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

/* Удалить установленный предыдущей функцией background-image */
const hideImage = (e) => {
    const previewContext = document.querySelector(".images-header");
    previewContext.style.backgroundImage = `none`;
    previewContext.classList.remove("images-header_active");
};

/* Компонент отображения одной фотографии */
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