import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom"
import {useAuthState} from "react-firebase-hooks/auth"
import cn from "classnames"

import {auth, db} from "lib/firebase"
import Icon from "components/Icon"

import style from './style.module.scss'
import images from 'assets/img'
import icons from 'assets/svg'

const Header = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    const [isInfoOpen, setInfoOpen] = useState(false)
    const [isAppsOpen, setAppsOpen] = useState(false)

    const popupRef = useRef(null)
    const appsRef = useRef(null)

    const onSignOut = () => {
        auth
            .signOut()
            .then(() => {
                db
                    .users
                    .doc(user.uid)
                    .update({
                        online: false
                    }, {
                        merge: true
                    })
            })
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef?.current && !popupRef?.current.contains(event.target)) {
                event.stopPropagation()
                setInfoOpen(false)
            }
            if (appsRef?.current && !appsRef?.current.contains(event.target)) {
                event.stopPropagation()
                setAppsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [popupRef])

    return (
        <div className={style.header}>
            <div className={style.header_logo} onClick={() => navigate('/chat')}>
                <img src={images.SlackLogo} alt="logo"/>
                <p>Slack</p>
            </div>

            <div/>

            <div className={style.header_apps}>
                <div className={cn(style.icon_wrapper, {[style.icon_wrapper__open]: isAppsOpen})}>
                    <Icon icon={icons.Apps} classIcon={style.apps_icon} onClick={() => setAppsOpen(!isAppsOpen)}/>

                    <div ref={appsRef}>
                        {isAppsOpen && (
                            <div className={style.apps_pop_up}>
                                <a className={style.apps_item} href="https://drive-clone-ef41c.web.app/" target='_blank' rel="noopener noreferrer">
                                    <img src={images.DocsLogo} alt="logo"/>
                                </a>
                                <a className={style.apps_item} href="https://docs-clone-5f2a9.web.app/docs" target='_blank' rel="noopener noreferrer">
                                    <img src={images.DriveLogo} alt="logo"/>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cn(style.header_avatar, {[style.header_avatar__open]: isInfoOpen})}>
                    {user?.photoURL || user?.displayName ? (
                        <img
                            src={user?.photoURL}
                            alt={user?.displayName}
                            onClick={() => setInfoOpen(!isInfoOpen)}
                        />
                    ) : (
                        <div
                            className={style.header_avatar__blank}
                            onClick={() => setInfoOpen(!isInfoOpen)}
                        >
                            {user?.email.slice(0, 2)}
                        </div>
                    )}

                    <div ref={popupRef}>
                        {isInfoOpen && (
                            <div className={style.info_pop_up}>
                                <div className={style.info_pop_up__info}>
                                    <p>{user?.displayName}</p>
                                    <p>{user?.email}</p>
                                </div>
                                <div
                                    className={style.sign_out}
                                    onClick={onSignOut}
                                >
                                    Sign Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Header