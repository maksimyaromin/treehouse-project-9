import React from "react";
import Photos from "../photos";

const Container = (props) => {
    const source = props.source;
    return (
        <div className="images-wrapper">
            <header className="tag">
                <span>{props.tag}</span>
            </header>
            {source && source.hasImages
                ? (
                    <Photos source={source.images} />
                )
                : (
                    <div className="empty-error">
                        <span>Извините, по вашему запросу ничего не найдено</span>
                    </div>
                )
            }
        </div>
    );
};

export default Container;