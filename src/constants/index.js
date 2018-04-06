/* Файл содержит некоторые констаныт. Для такого маленького приложения они конечно не особо полезны. Но это хорошая практика. Мало вероятно что это приложение будет
    развиваться, но почему от этого не писать код правильно */
    
export const FLICKR_API_URL = "https://api.flickr.com/services/rest/";
export const FLICKR_API_METHODS = {
    [Symbol.for("FLICKR_METHOD.SEARCH")]: "flickr.photos.search"
};
export const FLICKR_API_STATUSES = {
    [Symbol.for("FLICKR_STATUS.DONE")]: "ok",
    [Symbol.for("FLICKR_STATUS.FAIL")]: "fail"
};