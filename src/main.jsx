import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {BrowserRouter} from "react-router-dom"

import App from "./App"
import store from "state/store"

import "styles/general.scss"
import 'emoji-mart/css/emoji-mart.css'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
)
