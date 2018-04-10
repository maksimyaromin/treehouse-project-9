import React from "react";
import PropTypes from "prop-types";

/* Error 500 representation with error text and Flicker error code (if any) */
const Error500 = (props) => {
    return (
        <div className="error">
            <div className="error-code">
                <span>500</span>
                {props.code
                    ? <span> {props.code}</span>
                    : null
                }
            </div>
            <div className="error-text">
                <div className="error-text__description">
                    <span>Sorry, something went wrong</span>
                </div>
                <div className="error-text__message">
                    <span>{props.message}</span>
                </div>
            </div>
        </div>
    );
};
Error500.propTypes = {
    code: PropTypes.number,
    message: PropTypes.string
};

export default Error500;