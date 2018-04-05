import React from "react";

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

const hideImage = (e) => {
    const previewContext = document.querySelector(".images-header");
    previewContext.style.backgroundImage = `none`;
    previewContext.classList.remove("images-header_active");
};

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

export default Photo;