import React from "react";
import ReactDOM from "react-dom";
import Gallery from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import FLICKR_API_KEY from "./config";
import registerServiceWorker from "./registerServiceWorker";

/* The main entry point to the application.  Key for Flickr API must be transmit in the entrance to the Gallery component. This key must be in the config.js file 
    at the same level as this file. See README.md in the root of the application for details. Without a properly created key file, the application will not run. */
ReactDOM.render(
    (
        <Router>
            <Gallery apiKey={FLICKR_API_KEY} />
        </Router>
    ),
    document.getElementById("root")
);

registerServiceWorker();