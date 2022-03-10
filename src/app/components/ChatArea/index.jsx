import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"
import {useSelector} from "react-redux"
import {useCollection, useDocument} from "react-firebase-hooks/firestore"
import {Oval} from "react-loader-spinner"

import {db} from "lib/firebase"
import Icon from "components/Icon"
import TitleWithAvatar from "components/TitleWithAvatar"
import ChatInput from "components/ChatArea/ChatInput"

import style from './style.module.scss'
import icons from "assets/svg"

const ChatArea = () => {
    const bottomRef = useRef(null)
    const {room} = useSelector((state) => state.app)

    const queryRef = useRef(null)

    const [roomDetails] = useDocument(
        room.channels && room.roomId && db.channels.doc(room.roomId)
        || room.roomId && db.directs.doc(room.roomId)
    )
    const [roomMessages, loading] = useCollection(
        room.channels && room.roomId && db
            .channels
            .doc(room.roomId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
        || room.roomId && db
            .directs
            .doc(room.roomId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    )

    useEffect(() => {
        bottomRef?.current?.scrollIntoView({behavior: "smooth"})
    }, [room.roomId, loading])

    useEffect(() => {
        queryRef.current = room.roomId && room.channels
            ? db.channels.doc(room.roomId).collection('messages')
            : db.directs.doc(room.roomId).collection('messages')
    }, [room.roomId, room.channels])

    if (!roomMessages && !roomDetails) {
        return (
            <div className={cn(style.chat_wrapper, style.chat_wrapper__empty)}>
                Choose any chat.
            </div>
        )
    }

    return (
        <>
            {!loading ? (
                <div className={style.chat_wrapper}>
                    <div className={style.chat_header}>
                        <div className={style.chat_header__left}>
                            <TitleWithAvatar.TitleWithAvatarWrap
                                channels={roomDetails?.data().channels}
                                photoURL={roomDetails?.data().photoURL}
                                title={roomDetails?.data().name}
                                className={style.chat_header_info}
                            />

                            <p>{roomDetails?.data().usersIds.length} members</p>
                        </div>

                        <div
                            className={style.chat_header__right}
                            //TODO popup with details
                            onClick={() => {
                            }}
                        >
                            <Icon icon={icons.Info} classIcon={style.chat_details__icon}/>
                            <p>Details</p>
                        </div>
                    </div>
                    <div className={style.chat_container}>
                        <div className={style.chat_messages}>

                            {roomMessages?.docs.map((doc) => (
                                <div key={doc.id}/>
                                // <Message
                                //     key={doc.id}
                                //     message={doc.data().message}
                                //     timestamp={doc.data().timestamp}
                                //     user={doc.data().user}
                                //     userImage={doc.data().userImage}
                                // />
                            ))}

                            <div ref={bottomRef}/>
                        </div>

                        <ChatInput
                            collection={queryRef.current}
                            queryRef={queryRef?.current}
                            bottomRef={bottomRef}
                            channelName={roomDetails?.data().name}
                            room={room}
                        />
                    </div>
                </div>
            ) : (
                <div className={cn(style.chat_wrapper, style.chat_wrapper__empty)}>
                    <Oval
                        color="#3f0f40" height={100} width={100}
                    />
                </div>
            )}
        </>
    )
}

export default ChatArea