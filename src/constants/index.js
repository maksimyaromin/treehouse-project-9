/* The file contains some constants. For such a small application, they certainly are not particularly useful. But this is a good practice.It is unlikely that 
   this application will be developed, but why not write the code correctly */
export const FLICKR_API_URL = "https://api.flickr.com/services/rest/";
export const FLICKR_API_METHODS = {
    [Symbol.for("FLICKR_METHOD.SEARCH")]: "flickr.photos.search"
};
export const FLICKR_API_STATUSES = {
    [Symbol.for("FLICKR_STATUS.DONE")]: "ok",
    [Symbol.for("FLICKR_STATUS.FAIL")]: "fail"
};