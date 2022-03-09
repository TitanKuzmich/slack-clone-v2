import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Oval} from "react-loader-spinner"
import {useAuthState} from "react-firebase-hooks/auth"

import {auth} from "lib/firebase"
import {getChannelsList, getDirectsList} from "state/dispatchers/channels"
import Icon from "components/Icon"
import SidebarOption from "components/Sidebar/SidebarOption"
import {sidebarOptions, sidebarChannelsOptions, sidebarDirectsOptions} from "components/Sidebar/helper"

import style from './style.module.scss'
import icons from "assets/svg"

const Sidebar = () => {
    const [user] = useAuthState(auth)

    const {roomId} = useSelector(state => state.app)
    const {channels, isLoadingChannels, directs, isLoadingDirects} = useSelector(state => state.channels)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getChannelsList(user.uid))
        dispatch(getDirectsList(user.uid))
    }, [])

    return (
        <div className={style.sidebar_container}>
            <div className={style.sidebar_header}>
                <div className={style.sidebar_info}>
                    <h2>Work place</h2>
                    <Icon icon={icons.Edit} classIcon={style.sidebar_info__edit}/>
                </div>
            </div>

            <div className={style.sidebar_options_container}>
                {/*{sidebarOptions.map((option, ind) => (*/}
                {/*    <SidebarOption*/}
                {/*        key={`${option.title}_${ind}`}*/}
                {/*        Icon={option.icon}*/}
                {/*        title={option.title}*/}
                {/*        haveDivider={option.haveDivider}*/}
                {/*    />*/}
                {/*))}*/}

                <div className={style.sidebar_channels_container}>
                    <div className={style.sidebar_channels_header}>
                        {sidebarChannelsOptions.map((option, ind) => (
                            <SidebarOption
                                key={`${option.title}_${ind}`}
                                icon={option.icon}
                                title={option.title}
                                haveDivider={option.haveDivider}
                                addAction={option.addAction}
                                bold={option.bold}
                                channels
                            />
                        ))}
                    </div>

                    <div className={style.sidebar_channels_content}>
                        {!isLoadingChannels
                            ? channels.length > 0 && (
                            <>
                                {channels.map((channel) => (
                                    <SidebarOption
                                        key={channel.id}
                                        id={channel.id}
                                        title={channel.name}
                                        active={roomId}
                                        channels
                                    />
                                ))}
                            </>
                        ) : (
                                <div className="loading_wrapper">
                                    <Oval color="#f8f8f8" height={20} width={20}/>
                                </div>
                            )
                        }
                    </div>
                </div>
                
                <div className={style.sidebar_directs_container}>
                    <div className={style.sidebar_channels_header}>
                        {sidebarDirectsOptions.map((option, ind) => (
                            <SidebarOption
                                key={`${option.title}_${ind}`}
                                icon={option.icon}
                                title={option.title}
                                haveDivider={option.haveDivider}
                                addAction={option.addAction}
                                bold={option.bold}
                            />
                        ))}
                    </div>

                    <div className={style.sidebar_directs_content}>
                        {!isLoadingDirects
                            ? directs.length > 0 && (
                            <>
                                {directs.map((direct) => (
                                    <SidebarOption
                                        key={direct.id}
                                        id={direct.id}
                                        photoURL={direct.previewURL}
                                        title={direct.name}
                                        active={roomId}
                                    />
                                ))}
                            </>
                        ) : (
                                <div className="loading_wrapper">
                                    <Oval color="#f8f8f8" height={20} width={20}/>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Sidebar