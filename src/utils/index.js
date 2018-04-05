import {
    FLICKR_API_URL,
    FLICKR_API_METHODS
} from "../constants";

export const makeRequest = (apiKey, tag, page) => {
    return `
        ${FLICKR_API_URL}?
            method=${FLICKR_API_METHODS[Symbol.for("FLICKR_METHOD.SEARCH")]}&api_key=${apiKey}&tags=${tag}&page=${page}&format=json&nojsoncallback=1`;
};

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