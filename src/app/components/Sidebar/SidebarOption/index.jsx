import React, {useEffect, useState} from 'react'
import {useDispatch} from "react-redux"
import cn from 'classnames'
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db} from "lib/firebase"
import {createRoom} from "state/dispatchers/channels"
import {enterRoom} from "state/actions/app"
import CreateModal from "components/Modal/CreateModal"
import TitleWithAvatar from "components/TitleWithAvatar"
import Icon from "components/Icon"

import style from './style.module.scss'
import icons from "assets/svg"

const DEFAULT_DATA = {
    name: "",
    private: false,
    creator: "",
    previewURL: "",
    usersIds: []
}

const SidebarOption = ({
                           icon,
                           title,
                           id,
                           creator,
                           active,
                           bold,
                           addAction,
                           deleteAction,
                           haveDivider,
                           photoURL,
                           channels = false
                       }) => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()

    const [isOpen, setOpen] = useState(false)
    const [data, setData] = useState(DEFAULT_DATA)
    const [deleteAvailable, setDeleteAvailable] = useState(false)

    const selectChannel = () => {
        if (id) {
            dispatch(enterRoom({
                roomId: id,
                channels: channels
            }))
        }
    }

    const onClose = () => {
        setOpen(false)
        setData(DEFAULT_DATA)
    }

    const onCreateRoom = () => {
        let channelsData = {
            ...data,
            creator: user.uid,
            usersIds: [
                ...data.usersIds,
                user.uid
            ],
            timestamp: db.getCurrentTimestamp,
            isChannel: channels
        }

        dispatch(createRoom(channelsData, channels, onClose))
    }

    useEffect(() => {
        (user.uid === creator || !channels)
        && setDeleteAvailable(true)
    }, [user])

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
                channels={channels}
            />
            }

            <div
                className={cn(style.option_container, {
                    [style.option_container__active]: active && id === active,
                    [style.option_container__border]: haveDivider,
                    [style.option_container__delete]: deleteAction && deleteAvailable
                })}
                onClick={
                    addAction
                        ? () => setOpen(true)
                        : selectChannel
                }
            >
                {icon ? (
                    <>
                        <div className={style.option_icon__container}>
                            <Icon icon={icon} classIcon={style.option_icon}/>
                        </div>
                        <h3 className={cn({[style.option_title__bold]: bold})}>
                            {title}
                        </h3>
                    </>
                ) : (
                    <TitleWithAvatar.TitleWithAvatarNoWrap
                        channels={channels}
                        photoURL={photoURL}
                        title={title}
                    />
                )}

                {deleteAction && (deleteAvailable || !channels) &&
                <Icon icon={icons.Delete} classIcon={style.icon_delete} onClick={(e) => deleteAction(e, id, channels)}/>
                }
            </div>
        </>
    )
}

export default SidebarOption