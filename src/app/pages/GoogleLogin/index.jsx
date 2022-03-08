import React from 'react'

import Icon from "components/Icon"

import style from './style.module.scss'
import icons from "assets/svg"

const GoogleLogin = () => {

    return (
        <div className={style.login_container}>
            <Icon icon={icons.Google}/>
        </div>
    )
}

export default GoogleLogin