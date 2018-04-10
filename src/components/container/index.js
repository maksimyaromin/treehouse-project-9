import React from "react";
import Photos from "../photos";
import PropTypes from "prop-types";
import SourceModel from "../../models/source";

/* General container for a page with photos */
const Container = (props) => {
    const source = props.source;
    const hasContent = source && source.hasImages;
    let message = null;
    /* If images are loading at the moment, then the loader will be recorded in the field */
    if(props.isLoading) {
        message = <img className="images-message__loader" src="./assets/images/loader.svg" alt="Loading..." />;
    } else if(!hasContent) { /* if there are no images - then display either a warning or a welcome message */
        message = props.tag
            ? (
                <div className="images-message_empty">
                    <span className="images-message__line-1">No results found</span>
                    <span className="images-message__line-2">This search did not return any results, please try again.</span>
                </div>
            )
            : (
                <div className="images-message_welcome">
                    <span className="images-message__line-1">Welcome to the Gallery</span>
                    <span className="images-message__line-2">In order to view some wonderful photos, enter the category you are interested in in the search field at the top of the page. Also you can view photos from several categories we have prepared for you.</span>
                </div>
            );
    }
    return (
        <div className="images-wrapper">
            <header className="images-header">
                <div className="images-header__wrapper">
                    <div className="images-header__tag">
                        <span>{props.tag || "..."}</span>
                    </div>
                    {hasContent
                        ? (
                            <div className="images-header__page">
                                <span>
                                    <span className="images-header__page-info">{source.images.length}</span> / <span className="images-header__page-total">{source.total}</span>
                                </span>
                            </div>
                        )
                        : null
                    }
                </div>
            </header>
            {hasContent
                ? (
                    <div className="images">
                        <Photos source={source.images} />
                        {message}
                    </div>
                )
                : (
                    <div className="images-message">
                        {message}
                    </div>
                )
            }
        </div>
    );
};
Container.propTypes = {
    tag: PropTypes.string,
    source: PropTypes.instanceOf(SourceModel),
    isLoading: PropTypes.bool
};

export default Container;