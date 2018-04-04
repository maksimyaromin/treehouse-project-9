import React from "react";
import Photos from "../photos";

const Container = (props) => {
    return (
        <div className="images-wrapper">
            <header className="tag">
                <span>{props.tag}</span>
            </header>
            {props.source && props.source.hasImages
                ? (
                    <Photos source={props.source} />
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