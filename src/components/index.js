import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Route,
    NavLink,
    Switch,
    withRouter
} from "react-router-dom";
import ImagesContainer from "./container";
import SearchBox from "./search";
import SourceModel from "../models/source";
import {
    makeRequest,
    debounce,
    fadeIn,
    fadeOut,
    scrollToTop
} from "../utils";
import {
    Error404,
    Error500
} from "./errors";
import { FLICKR_API_STATUSES } from "../constants";

/*The main component (top level component). Contains the basic logic of the application and returns the main layout in the renderer*/
class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHome: this.props.location.pathname === "/",
            isLoading: false,
            keyWord: "",
            sources: new Map(),
            error: null
        };
    }
    /* The attribute contains the current tag for finding images for quick access to it */
    get tag() {
        return this.state.isHome 
            ? this.state.keyWord
            : this.props.location.pathname.replace(/\//gi, "");
    }
    /* The attribute contains the current photo store by tag. If the photos were not downloaded by the tag, it will return null */
    get source() {
        const sources = this.state.sources;
        if(!sources.has(this.tag)) {
            return null;
        }
        return sources.get(this.tag);
    }
    componentDidMount() {
        /* The application supports the function of loading images, if the user listed to the end of the page (the implementation of endless scrolling) */
        window.addEventListener("scroll", debounce(this.onScroll, 200).bind(this), false);
        /* The interface has an element that can help the user quickly return to the top of the page */
        const toTop = document.querySelector(".to-top");
        if(toTop) {
            toTop.addEventListener("click", () => {
                scrollToTop(600);
            });
        }
    }
    componentWillMount() {
        /* If we do not start from the home page, then  pictures  download immediately by tag */
        if(!this.state.isHome) {
            this.componentWillShowImages(this.tag);
        }
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location.pathname;
        const isNewRoute = location !== "/" && this.props.location.pathname !== location;
        this.setState({
            isHome: location === "/",
            error: null
        }, () => {
            if(isNewRoute) {
                /* If we change the route, then load new pictures if the page is not homepage */
                this.componentWillShowImages(location.replace(/\//gi, ""));
            }
        });
    }
    /* Function with the logic for displaying photos.If there is a photo store on the requesting tag in the state, it will be returned 
	   immediately (only if isForce is not set, if it is set - that means we load new pictures to the existing repository). */
    componentWillShowImages(tag, isForce) {
        const source = this.state.sources.get(tag);
        if(source && !isForce) { return; }
        let apiRequest;
        if(source) {
            apiRequest = makeRequest(this.props.apiKey, tag, source.page + 1);
        } else {
            apiRequest = makeRequest(this.props.apiKey, tag, 1);
        }
        this.setState({
            isLoading: true
        }, () => this.componentWillLoadImages(tag, apiRequest, source));
    }
    /* Request for new images using fetch. Supports error handling logic. If an exception is returned during the query, the corresponding property will 
	   be set in the state and the error will be displayed on the page. */
    componentWillLoadImages(tag, apiRequest, source) {
        fetch(apiRequest, {
            mode: "cors",
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(response => {
            const { stat } = response;
            if(stat === FLICKR_API_STATUSES[Symbol.for("FLICKR_STATUS.DONE")]) {
                const sources = this.state.sources;
                if(source) {
                    source.update(response.photos);
                    sources.set(tag, source);
                } else {
                    sources.set(tag, new SourceModel(response.photos));
                }
                this.setState({
                    sources,
                    isLoading: false
                });
                return;
            }
           
            const { message, code } = response;
            this.setState({
                isLoading: false,
                error: {
                    message,
                    code
                }
            });
        }).catch(err => {
            this.setState({
                isLoading: false,
                error: {
                    message: err.message
                }
            });
        });
    }
    /* Realization of the endless scroll functional */
    onScroll() {
        const source = this.source;
        if(!source) { return; }
        const offsetTop = window.innerHeight + window.scrollY;
        const inBottom = document.querySelector(".wrapper").scrollHeight === offsetTop;
        const toTop = document.querySelector(".to-top");
        if(offsetTop > document.body.scrollHeight + 500) {
            fadeIn(toTop);
        } else {
            fadeOut(toTop);
        }
        if(inBottom && !this.state.isLoading && source.hasImages && source.total > source.images.length) {
            this.componentWillShowImages(this.tag, true);
        }
    }
    /* Processing input in the search field */
    onInput(e) {
        const value = e.target.value;
        this.setState({
            keyWord: value
        });
    }
    /* Image Search Function */
    onSearch(e) {
        e.preventDefault();
        this.componentWillShowImages(this.tag);
    }
    render() {
        return (
            <div className="wrapper">
                <header className="header">
                    <nav className="header-nav">
                        <ul className="header-nav__list">
                            <li key="search" className="header-nav__list-item header-nav__list-item_search">
                                {this.state.isHome
                                    ? (
                                        <SearchBox 
                                            keyWord={this.state.keyWord}
                                            onInput={this.onInput.bind(this)} 
                                            onSubmit={this.onSearch.bind(this)}
                                        />
                                    )
                                    : (
                                        <NavLink 
                                            exact
                                            className="header-nav__list-item-link" 
                                            to="/"
                                            activeClassName="header-nav__list-item-link_active"
                                        >
                                            Home
                                        </NavLink>
                                    )
                                }
                            </li>
                            <li key="belarus" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/belarus"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Belarus
                                </NavLink>
                            </li>
                            <li key="azores" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/azores"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Azores
                                </NavLink>
                            </li>
                            <li key="sardinia" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/sardinia"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Sardinia
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>

                {/* The same component is used for image mapping. I decided not to do many components with the same logic. There is a route 
				in the route table /:tag, etc you can enter any keyword directly into the address line (/sunsets)and get the result */}
                <main className="content">
                    <Switch>
                        <Route exact path="/" render={() => (
                            this.state.error
                                ? (
                                    <Error500 code={this.state.error.code} message={this.state.error.message} />
                                )
                                : (
                                    <ImagesContainer tag={this.state.keyWord} source={this.source} isLoading={this.state.isLoading} />
                                )
                        )} />
                        <Route exact path="/:tag" render={(props) => (
                            this.state.error
                                ? (
                                    <Error500 code={this.state.error.code} message={this.state.error.message} />
                                )
                                : (
                                    <ImagesContainer tag={props.match.params.tag} source={this.source} isLoading={this.state.isLoading} />                           
                                )
                        )} />
                        <Route component={Error404} />
                    </Switch>
                </main>
                <div className="to-top"></div>
            </div>
        );
    }
};
Gallery.propTypes = {
    apiKey: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired
};

export default withRouter(Gallery);