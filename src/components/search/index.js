import React from "react";
import PropTypes from "prop-types";

/* Component with a search field. Nothing complicated. Just a field and a button. The layout is similar to a Flicker. */
const SearchBox = (props) => {
    const icon = `
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./assets/images/sprite.svg#icon-search"></use> `;
    return (
        <div className="search-form-wrapper">
            <form className="search-form" onSubmit={e => props.onSubmit(e)}>
                <input 
                    className="search-form__input" 
                    type="text" 
                    name="tag" 
                    placeholder="What tag do you want?" 
                    defaultValue={props.keyWord}
                    onInput={e => props.onInput(e)}
                />
                <div className="search-form__button-container">
                    <svg className="search-form__icon" dangerouslySetInnerHTML={{ __html: icon }}></svg>
                    <input
                        className="search-form__button"
                        type="submit"
                        tabIndex={-1}
                        value="Search"
                    />
                </div>
            </form>
        </div>
    );
};
SearchBox.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onInput: PropTypes.func.isRequired,
    keyWord: PropTypes.string
};

export default SearchBox;