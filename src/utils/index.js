/* The file contains auxiliary functions that are used in different places of the application. */
import {
    FLICKR_API_URL,
    FLICKR_API_METHODS
} from "../constants";

/* Creates a request to the API flicker, adding to it a user key, tag, and the page if necessary */
export const makeRequest = (apiKey, tag, page) => {
    return `
        ${FLICKR_API_URL}?
            method=${FLICKR_API_METHODS[Symbol.for("FLICKR_METHOD.SEARCH")]}&api_key=${apiKey}&tags=${tag}&page=${page}&format=json&nojsoncallback=1`;
};

/* A common function in JS. Helps to work with frequently repeated calls.  Google for details, if you have not heard about this. */
export const debounce = (action, ms) => {
    let timer = null;
    return function (...args) {
        const onComplete = () => {
            action.call(this, args);
            timer = null;
        };
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, ms);
    };
};

/* Here three functions: simple implementation of animation of some actions. The name of the functions reflects their meaning. */
export const fadeIn = element => {
    if(element.classList.contains("fade-in")) { return; }
    let opacity = 0.1;
    element.style.display = "block";
    element.classList.add("fade-in");
    let timer = setInterval(() => {
        if(opacity >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        element.style.filter = `alpha(opacity=${opacity * 100})`;
        opacity += opacity * 0.1;
    }, 10);
};

export const fadeOut = element => {
    if(!element.classList.contains("fade-in")) { return; }
    let opacity = 1;
    let timer = setInterval(() => {
        if(opacity <= 0.1) {
            clearInterval(timer);
            element.style.display = "none";
            element.classList.remove("fade-in");
        }
        element.style.opacity = opacity;
        element.style.filter = `alpha(opacity=${opacity * 100})`;
        opacity -= opacity * 0.1;
    }, 50);
};

export const scrollToTop = duration => {
    if (duration <= 0) { return };
    const difference = 0 - window.scrollY;
    const perTick = difference / duration * 10;
    
    setTimeout(function() {
        let tick = window.scrollY + perTick;
        if(tick <= 1) { tick = 0; }
        window.scrollTo(0, tick);
        if (window.scrollY === 0) { return };
        scrollToTop(duration - 10);
    }, 10);
};