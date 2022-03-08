import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import nextId from "react-id-generator"

import {db} from "lib/firebase"
import Icon from "components/Icon"
import SidebarOption from "components/SidebarOption"
import {sidebarOptions, sidebarSecondaryOptions} from "components/Sidebar/helper"

import style from './style.module.scss'
import icons from "assets/svg"
import {Oval} from "react-loader-spinner"

const Sidebar = () => {
    const {roomId} = useSelector(state => state.app)

    const {channels, isLoadingChannels, directs, isLoadingDirects} = useSelector(state => state.channels)

    return (
        <div className={style.sidebar_container}>
            <div className={style.sidebar_header}>
                <div className={style.sidebar_info}>
                    <h2>Work place</h2>
                    <Icon icon={icons.Edit} classIcon={style.sidebar_info__edit}/>
                </div>
            </div>

            {/*{sidebarOptions.map((option, ind) => (*/}
            {/*    <SidebarOption*/}
            {/*        key={`${option.title}_${ind}`}*/}
            {/*        Icon={option.icon}*/}
            {/*        title={option.title}*/}
            {/*        haveDivider={option.haveDivider}*/}
            {/*    />*/}
            {/*))}*/}

            {sidebarSecondaryOptions.map((option, ind) => (
                <SidebarOption
                    key={`${option.title}_${ind}`}
                    icon={option.icon}
                    title={option.title}
                    haveDivider={option.haveDivider}
                    addAction={option.addAction}
                    channels
                />
            ))}

            {!isLoadingChannels
                ? channels.length > 0 && (
                <>
                    {channels.map((channel) => (
                        <SidebarOption
                            key={channel.id}
                            id={channel.id}
                            title={channel.name}
                            active={roomId}
                        />
                    ))}
                </>
            ) : (
                    <div className="loading_wrapper">
                        <Oval color="#33A852" height={20} width={20}/>
                    </div>
                )
            }
        </div>
    )
}

export default Sidebar