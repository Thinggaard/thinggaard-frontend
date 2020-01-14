// These must be the first lines in src/index.js
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {HelmetProvider} from 'react-helmet-async';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Store from "./store/Store";
import WebFont from "webfontloader";


WebFont.load({
    google: {
        families: ['Roboto:300,400,400i,500,600,700&display=swap']
    },
});

ReactDOM.render(
    <Store>
        <HelmetProvider>
        <App/>
        </HelmetProvider>
    </Store>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
