// import './assets/common.sass'
// function changeTitle () {
//     window.$('#app').html('Parcel 打包包')
// }


// setTimeout(function () {
//     changeTitle()
// }, 2000)

require('babel-polyfill')
import React from 'react'
import { render } from 'react-dom'
import {
    BrowserRouter
} from 'react-router-dom'
import App from './app'

const rootElement = document.getElementById('app')


render(
    <BrowserRouter>
    <App />
    </BrowserRouter>, 
    rootElement
)
