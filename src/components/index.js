import React, { Component } from "react";
import {
    Route,
    NavLink,
    Switch,
    withRouter
} from "react-router-dom";
import ImagesContainer from "./container";
import SearchBox from "./search";
import {
    FLICKR_API_URL,
    FLICKR_API_METHODS
} from "../constants";
import SourceModel from "../models/source";

const makeRequest = (apiKey, tag) => {
    return `
        ${FLICKR_API_URL}?
            method=${FLICKR_API_METHODS[Symbol.for("FLICKR_METHOD.SEARCH")]}&api_key=${apiKey}&tags=${tag}&format=json&nojsoncallback=1`;
};

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHome: this.props.location.pathname === "/",
            keyWord: "",
            sources: new Map()
        };
    }
    get tag() {
        return this.state.isHome 
            ? this.state.keyWord
            : this.props.location.pathname.replace(/\//gi, "");
    }
    get source() {
        const sources = this.state.sources;
        if(!sources.has(this.tag)) {
            return null;
        }
        return sources.get(this.tag);
    }
    componentWillMount() {
        if(!this.state.isHome) {
            this.componentWillLoadImages(this.tag);
        }
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location.pathname;
        if(location !== "/" && this.props.location.pathname !== location) {
            this.componentWillLoadImages(location.replace(/\//gi, ""));
        }
        this.setState({
            ...this.state,
            isHome: location === "/"
        });
    }
    componentWillLoadImages(tag) {
        if(this.state.sources.has(tag)) { return; }
        const apiRequest = makeRequest(this.props.apiKey, tag);
        fetch(apiRequest, {
            mode: "cors",
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(response => {
            const sources = this.state.sources;
            sources.set(tag, new SourceModel(response.photos));
            this.setState({
                ...this.state,
                sources
            });
        });
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
                                        <SearchBox />
                                    )
                                    : (
                                        <NavLink 
                                            exact
                                            className="header-nav__list-item-link" 
                                            to="/"
                                            activeClassName="header-nav__list-item-link_active"
                                        >
                                            Search
                                        </NavLink>
                                    )
                                }
                            </li>
                            <li key="sunsets" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/sunset"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Sunsets
                                </NavLink>
                            </li>
                            <li key="sea" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/sea"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Sea
                                </NavLink>
                            </li>
                            <li key="wind" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/wind"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Wind
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>

                <main className="content">
                    <Switch>
                        <Route exact path="/" render={() => (
                            <ImagesContainer tag={this.state.keyWord} source={this.source} />
                        )} />
                        <Route path="/:tag" render={(props) => (
                            <ImagesContainer tag={props.match.params.tag} source={this.source} />
                        )} />
                    </Switch>
                </main>
            </div>
        );
    }
};

export default withRouter(Gallery);