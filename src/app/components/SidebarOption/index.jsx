import React, {useState} from 'react'
import {useDispatch} from "react-redux"
import cn from 'classnames'
import {useAuthState} from "react-firebase-hooks/auth"

import {auth} from "lib/firebase"
import {createRoom} from "state/dispatchers/channels"
import {enterRoom} from "state/actions/app"
import CreateModal from "components/Modal/CreateModal"
import Icon from "components/Icon"

import style from './style.module.scss'

const DEFAULT_DATA = {
    name: "",
    private: false,
    creator: "",
    usersIds: []
}

const SidebarOption = ({icon, title, id, active, addAction, haveDivider, channels}) => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()

    const [isOpen, setOpen] = useState(false)
    const [data, setData] = useState(DEFAULT_DATA)

    const selectChannel = () => {
        if (id) {
            dispatch(enterRoom({
                roomId: id,
            }))
        }
    }

    const onClose = () => {
        setOpen(false)
        setData(DEFAULT_DATA)
    }

    const onCreateRoom = () => {
        const channelsData = {
            ...data,
            creator: user.uid,
            usersIds: [
                ...data.usersIds,
                user.uid
            ]
        }

        dispatch(createRoom(channelsData, channels, onClose))
    }

    return (
        <>
            {isOpen &&
            <CreateModal
                data={data}
                setData={setData}
                setOpen={setOpen}
                headerName={channels ? 'Channel' : 'Chat'}
                onConfirmAction={onCreateRoom}
                onCloseAction={onClose}
                channels
            />
            }

            <div
                className={cn(style.option_container, {
                    [style.option_container__active]: active && id === active,
                    [style.option_container__border]: haveDivider
                })}
                onClick={
                    addAction
                        ? () => setOpen(true)
                        : selectChannel
                }
            >
                {icon && <Icon icon={icon} classIcon={style.option_icon}/>}
                {icon ? (
                    <h3>{title}</h3>
                ) : (
                    <h3>
                        <span>#</span> {title}
                    </h3>
                )}
            </div>
        </>
    )
}

export default SidebarOption