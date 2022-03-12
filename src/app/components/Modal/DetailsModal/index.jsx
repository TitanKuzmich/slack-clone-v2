import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db} from "lib/firebase"
import {getUserList} from "state/dispatchers/app"
import Modal from "components/Modal"

import style from '../style.module.scss'
import {Oval} from "react-loader-spinner"
import dayjs from "dayjs"
import TitleWithAvatar from "components/TitleWithAvatar"

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

                        {info.isChannel
                        && <p
                            className={style.modal_content__text}><strong>Type: </strong>{info.private ? "Private" : "Public"}</p>
                        }

                        <br/>

                        {(data.members?.length > 0 && info.private)
                        || (data.members?.length > 0 && !info.isChannel) ? (
                            <p className={style.modal_content__text}>
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
                            </p>
                        ) : (
                            <p className={style.modal_content__text}>
                                <strong>Members: </strong>
                                <span>All users are added.</span>
                            </p>
                        )}
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