import React from "react";
import Photos from "../photos";

const Container = (props) => {
    const source = props.source;
    const hasContent = source && source.hasImages;
    let message = null;
    if(props.isLoading) {
        message = <img className="images-message__loader" src="./assets/images/loader.svg" alt="Loading..." />;
    } else if(!hasContent) {
        message = props.tag
            ? (
                <div className="images-message_empty">
                    <span className="images-message__line-1">No results found</span>
                    <span className="images-message__line-2">This search did not return any results, please try again.</span>
                </div>
            )
            : (
                <div className="images-message_welcome">
                    <span className="images-message__line-1">Добро пожаловать в галерею</span>
                    <span className="images-message__line-2">Для того, чтобы просмотреть несколько замечательных фотографий введите интересующую вас категорию в поле для поиска вверху страницы. Также вы можете просмотреть фотографии из нескольких заготовленных нами для вас категорий.</span>
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

export default Container;