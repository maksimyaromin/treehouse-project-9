import React from "react";

/* Error 404 representation */
const Error404 = () => {
    return (
        <div className="error">
            <div className="error-code">
                <span>404</span>
            </div>
            <div className="error-text">
                <div className="error-text__description">
                    <span>Sorry, the page you requested could not be found</span>
                </div>
            </div>
        </div>
    );
};

export default Error404;