import React from "react";
import ReactDOM from "react-dom";
import Gallery from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import { FLICKR_API_KEY } from "./config";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
    (
        <Router>
            <Gallery apiKey={FLICKR_API_KEY} />
        </Router>
    ),
    document.getElementById("root")
);

registerServiceWorker();