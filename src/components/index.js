import React, { Component } from "react";
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

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHome: this.props.location.pathname === "/",
            isLoading: false,
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
    componentDidMount() {
        window.addEventListener("scroll", debounce(this.onScroll, 200).bind(this), false);
        const toTop = document.querySelector(".to-top");
        if(toTop) {
            toTop.addEventListener("click", () => {
                scrollToTop(600);
            });
        }
    }
    componentWillMount() {
        if(!this.state.isHome) {
            this.componentWillShowImages(this.tag);
        }
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location.pathname;
        if(location !== "/" && this.props.location.pathname !== location) {
            this.componentWillShowImages(location.replace(/\//gi, ""));
        }
        this.setState({
            ...this.state,
            isHome: location === "/"
        });
    }
    componentWillShowImages(tag, isForce) {
        const source = this.state.sources.get(tag)
        if(source && !isForce) { return; }
        let apiRequest;
        if(source) {
            apiRequest = makeRequest(this.props.apiKey, tag, source.page + 1);
        } else {
            apiRequest = makeRequest(this.props.apiKey, tag, 1);
        }
        this.setState({
            ...this.state,
            isLoading: true
        });
        this.componentWollLoadImages(tag, apiRequest, source);
    }
    componentWollLoadImages(tag, apiRequest, source) {
        fetch(apiRequest, {
            mode: "cors",
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(response => {
            const sources = this.state.sources;
            if(source) {
                source.update(response.photos);
                sources.set(tag, source);
            } else {
                sources.set(tag, new SourceModel(response.photos));
            }
            this.setState({
                ...this.state,
                sources,
                isLoading: false
            });
        });
    }
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
    onInput(e) {
        const value = e.target.value;
        this.setState({
            ...this.state,
            keyWord: value
        });
    }
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
                            <li key="sea" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/osipovichi"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Osipovichi
                                </NavLink>
                            </li>
                            <li key="wind" className="header-nav__list-item">
                                <NavLink 
                                    exact
                                    className="header-nav__list-item-link" 
                                    to="/minsk"
                                    activeClassName="header-nav__list-item-link_active"
                                >
                                    Minsk
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>

                <main className="content">
                    <Switch>
                        <Route exact path="/" render={() => (
                            <ImagesContainer tag={this.state.keyWord} source={this.source} isLoading={this.state.isLoading} />
                        )} />
                        <Route path="/:tag" render={(props) => (
                            <ImagesContainer tag={props.match.params.tag} source={this.source} isLoading={this.state.isLoading} />
                        )} />
                    </Switch>
                </main>
                <div className="to-top"></div>
            </div>
        );
    }
};

export default withRouter(Gallery);