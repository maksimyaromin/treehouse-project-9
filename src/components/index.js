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

/* Основной компонент (компонент верхнего уровня). Содержит основную логику приложения и возвращает в рендере основную разметку */
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
    /* Свойство содержит текущий тег для поиска изображений для быстрого доступа к нему */
    get tag() {
        return this.state.isHome 
            ? this.state.keyWord
            : this.props.location.pathname.replace(/\//gi, "");
    }
    /* Свойство содержит текущее хранилище фотографий по тэгу. Если фотографии по тэгу не были загружены, то вернет null */
    get source() {
        const sources = this.state.sources;
        if(!sources.has(this.tag)) {
            return null;
        }
        return sources.get(this.tag);
    }
    componentDidMount() {
        /* Приложение поддерживает функцию подгрузки изображений, если пользователь долистал до конца страницы (реализация бесконечного скрола) */
        window.addEventListener("scroll", debounce(this.onScroll, 200).bind(this), false);
        /* В интерфейсе есть элемент, который может помочь пользователю быстро вернуться в верх страницы */
        const toTop = document.querySelector(".to-top");
        if(toTop) {
            toTop.addEventListener("click", () => {
                scrollToTop(600);
            });
        }
    }
    componentWillMount() {
        /* Если начинаем не с домашней страницы, то сразу загрузить картинки по тэгу */
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
                /* Если меняем маршрут, то загружаем новые картинки, если страницы не домашняя */
                this.componentWillShowImages(location.replace(/\//gi, ""));
            }
        });
    }
    /* Функция с логикой отображения фотографий. Если по запрашиваему тэгу в стэйте есть хранилище фотографий, то оно вернется сразу (только если не установлен
        признак isForce, если установлен - то значит мы подгружаем новые картинки к существующему хранилищу). */
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
    /* Запрос за новыми картинками при помощи fetch. Поддерживает логику обработки ошибок. Если в ходе запроса вернется исключение, то в стэйте будет установлено
        соответствующее свойство и ошибка отобразится на странице. */
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
    /* Реализация функционала бесконечного скролла */
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
    /* Обработка ввода в поле поиска */
    onInput(e) {
        const value = e.target.value;
        this.setState({
            keyWord: value
        });
    }
    /* Функция поиска изображений */
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

                {/* Для отображений изображений используется один и тот же компонент. Я решил не делать много компонентов с одной логикой. В таблице маршрутов
                    присутствует маршрут /:tag, т. е. вы можете ввести любое ключевое слово прямо в адрессную строку (/sunsets) и получить результаты */}
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