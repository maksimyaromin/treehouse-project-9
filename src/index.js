import React from "react";
import ReactDOM from "react-dom";
import Gallery from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import FLICKR_API_KEY from "./config";
import registerServiceWorker from "./registerServiceWorker";

/* Основаная точка входа в приложение. Компоненту Gallery нужно на вход передать ключ к Flickr API. Этот ключ должен находится в файле config.js на том же уровне что и этот
    файл. Подробнее вы можете прочитать в README.md в корне приложения. Без правильно созданного файла с ключом приложение не запустится. */
ReactDOM.render(
    (
        <Router>
            <Gallery apiKey={FLICKR_API_KEY} />
        </Router>
    ),
    document.getElementById("root")
);

registerServiceWorker();