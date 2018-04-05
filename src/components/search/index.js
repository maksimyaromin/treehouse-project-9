import React from "react";

const SearchBox = (props) => {
    const icon = `
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./assets/images/sprite.svg#icon-search"></use> `;
    return (
        <div className="search-form-wrapper">
            <form className="search-form">
                <input 
                    className="search-form__input" 
                    type="text" 
                    name="tag" 
                    placeholder="Тэг для поиска фото" 
                />
                <div className="search-form__button-container">
                    <svg className="search-form__icon" dangerouslySetInnerHTML={{ __html: icon }}></svg>
                    <input
                        className="search-form__button"
                        type="submit"
                        tabIndex="-1"
                        value="Search"
                    />
                </div>
            </form>
        </div>
    );
};

export default SearchBox;