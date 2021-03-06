import React from "react";
import ReactDOM from "react-dom";
import './fonts/Quicksand-VariableFont_wght.ttf';
import './fonts/StyleScript-Regular.ttf';
import "./styles/style.scss";
import "../node_modules/@mdi/font/css/materialdesignicons.min.css";
import '../node_modules/materialize-css/dist/css/materialize.min.css'
import '../node_modules/materialize-css/dist/js/materialize.min.js'
import App from "./App";

ReactDOM.render( <React.StrictMode>
    <App/>
    </React.StrictMode>,
    document.getElementById("root")
);