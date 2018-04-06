import React from "react";

/* Представление ошибки 404 */
const Error404 = () => {
    return (
        <div className="error">
            <div className="error-code">
                <span>404</span>
            </div>
            <div className="error-text">
                <div className="error-text__description">
                    <span>К сожалению, запрошенная вами страница не найдена</span>
                </div>
            </div>
        </div>
    );
};

export default Error404;