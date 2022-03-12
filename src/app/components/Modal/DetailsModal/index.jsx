import React, {useEffect, useState} from 'react'
import dayjs from "dayjs"
import {useDispatch, useSelector} from "react-redux"
import {useAuthState} from "react-firebase-hooks/auth"
import {Oval} from "react-loader-spinner"

import {auth, db} from "lib/firebase"
import {enterRoom} from "state/actions/app"
import {getUserList} from "state/dispatchers/app"
import {getChannelsList, getDirectsList} from "state/dispatchers/channels"
import Modal from "components/Modal"
import TitleWithAvatar from "components/TitleWithAvatar"

import style from '../style.module.scss'

const DEFAULT_DATA = {
    creator: {},
    members: []
}

const DetailsModal = ({info, onCloseAction}) => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()

    const [data, setData] = useState(DEFAULT_DATA)

    const {userList, isLoading} = useSelector(state => state.app)

    const findCreator = () => {
        let creator

        if (user.uid === info.creator) {
            creator = {
                id: user.uid,
                name: user.displayName,
                photoURL: user.photoURL
            }
        } else {
            creator = {...userList.filter(currUser => currUser.id === info.creator)[0]}
        }

        return creator
    }

    const findMembers = () => {
        const members = info.usersIds.map(id => {
            return [...userList, {
                id: user.uid,
                name: user.displayName,
                photoURL: user.photoURL
            }].filter(user => {
                return user.id === id && user
            })
        })

        return members.flat()
    }

    const getButtonText = () => {
        if (!info.isChannel) return "Delete Chat"
        if (info.private) return "Leave channel"
        if (user.uid === info.creator) return "Delete channel"
    }

    const onLeave = () => {
        if (!info.isChannel) {
            console.log(info)
            db
                .directs
                .doc(info.id)
                .delete()
                .then(() => {
                    dispatch(getDirectsList(user.uid))

                    dispatch(enterRoom({
                        roomId: "",
                        channels: false
                    }))
                    onCloseAction()
                })
                .catch(e => console.log(e.message))
        } else {
            if (user.uid === info.creator) {
                db
                    .channels
                    .doc(info.id)
                    .delete()
                    .then(() => {
                        dispatch(getChannelsList(user.uid))

                        dispatch(enterRoom({
                            roomId: "",
                            channels: false
                        }))
                        onCloseAction()
                    })
                    .catch(e => console.log(e.message))
            } else {
                const updatedUsersIds = info.usersIds.filter(id => id !== user.uid)

                db
                    .channels
                    .doc(info.id)
                    .update({
                        usersIds: updatedUsersIds
                    }, {merge: true})
                    .then(() => {
                        dispatch(getChannelsList(user.uid))

                        dispatch(enterRoom({
                            roomId: "",
                            channels: false
                        }))
                        onCloseAction()
                    })
                    .catch(e => console.log(e.message))
            }
        }
    }

    useEffect(() => {
        const creator = findCreator()
        const members = findMembers()

        setData({
            creator,
            members
        })
    }, [userList])

    useEffect(() => {
        dispatch(getUserList(user.uid))
    }, [])

    const header = () => {
        return (
            <span className={style.modal_header__text}>{info.channels ? "Channel" : "Chat "} details</span>
        )
    }

    const content = () => {
        return (
            <>
                {isLoading ? (
                    <div className="loading_wrapper">
                        <Oval color="#f8f8f8" height={20} width={20}/>
                    </div>
                ) : (
                    <>
                        <p className={style.modal_content__text}>
                            <strong>Created by: </strong>
                            {data.creator?.name}
                        </p>

                        <p className={style.modal_content__text}>
                            <strong>On </strong>
                            {dayjs(info.timestamp?.toDate()).format("MM.DD.YYYY")}
                            <strong> at </strong>
                            {dayjs(info.timestamp?.toDate()).format("HH:mm")}
                        </p>

                        {info.isChannel && (
                            <p className={style.modal_content__text}>
                                <strong>Type: </strong>{info.private ? "Private" : "Public"}
                            </p>
                        )}

                        <br/>

                        {(data.members?.length > 0 && info.private)
                        || (data.members?.length > 0 && !info.isChannel) ? (
                            <div className={style.modal_content__text}>
                                <strong>Members: </strong>
                                <div className={style.members}>
                                    {data.members?.map(member => (
                                        <TitleWithAvatar.TitleWithAvatarWrap
                                            key={member?.id}
                                            className={style.member_wrapper}
                                            channels={false}
                                            photoURL={member?.photoURL}
                                            title={member?.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className={style.modal_content__text}>
                                <strong>Members: </strong>
                                <span>All users are added.</span>
                            </p>
                        )}

                        {!info.isChannel || (info.private && info.isChannel) &&
                            <div className={style.delete_button} onClick={onLeave}>
                                {getButtonText()}
                            </div>
                        }
                    </>
                )}
            </>
        )
    }

    return (
        <Modal
            onCloseAction={onCloseAction}
            header={header}
            content={content}
            buttons={false}
        />
    )
}

export default DetailsModal