import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"
import {useSelector} from "react-redux"
import {useCollection, useDocument} from "react-firebase-hooks/firestore"
import {Oval} from "react-loader-spinner"

import {db} from "lib/firebase"
import Icon from "components/Icon"
import TitleWithAvatar from "components/TitleWithAvatar"
import Message from "components/ChatArea/Message"
import ChatInput from "components/ChatArea/ChatInput"
import DetailsModal from "components/Modal/DetailsModal"

import style from './style.module.scss'
import icons from "assets/svg"

const ChatArea = () => {
    const bottomRef = useRef(null)
    const {room} = useSelector((state) => state.app)

    const queryRef = useRef(null)

    const [inputHeight, setInputHeight] = useState(0)
    const [isShowDetails, setShowDetails] = useState(false)

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

    const onMessageDelete = (messageId) => {
        db
            .directs
            .doc(room.roomId)
            .collection('messages')
            .doc(messageId)
            .delete()
    }

    useEffect(() => {
        room.roomId && bottomRef?.current?.scrollIntoView({behavior: "smooth"})
    }, [room.roomId, loading])

    useEffect(() => {
        if(room.roomId) {
            queryRef.current = room.channels
                ? db.channels.doc(room.roomId).collection('messages')
                :  db.directs.doc(room.roomId).collection('messages')
        }
    }, [room.roomId, room.channels])

    if (!roomDetails && !room.roomId && !loading) {
        return (
            <div className={cn(style.chat_wrapper, style.chat_wrapper__empty)}>
                Choose any chat.
            </div>
        )
    }

    return (
        <>
            {!loading && room.roomId ? (
                <div className={style.chat_wrapper}>

                    {isShowDetails && (
                        <DetailsModal
                            info={roomDetails && db.formatDoc(roomDetails)}
                            onCloseAction={() => setShowDetails(false)}
                        />
                    )}

                    <div className={style.chat_header}>
                        <div className={style.chat_header__left}>
                            <TitleWithAvatar.TitleWithAvatarWrap
                                channels={roomDetails?.data()?.channels}
                                photoURL={roomDetails?.data()?.photoURL}
                                title={roomDetails?.data()?.name}
                                className={style.chat_header_info}
                            />

                            <p>{roomDetails?.data()?.usersIds?.length} members</p>
                        </div>

                        <div
                            className={style.chat_header__right}
                            onClick={() => setShowDetails(true)}
                        >
                            <Icon icon={icons.Info} classIcon={style.chat_details__icon}/>
                            <p>Details</p>
                        </div>
                    </div>
                    <div
                        className={style.chat_container}
                    >
                        <div
                            className={style.chat_messages}
                            style={{
                                minHeight: `calc(100vh - ${inputHeight + 1.5}px - 190.5px)`,
                                maxHeight: `calc(100vh - ${inputHeight + 1.5}px - 190.5px)`
                            }}
                        >

                            {roomMessages?.docs.map((doc) => (
                                <Message
                                    key={doc.id}
                                    collection={queryRef.current}
                                    message={db.formatDoc(doc)}
                                    deleteMessage={onMessageDelete}
                                />
                            ))}

                            <div className={style.chat_bottom} ref={bottomRef}/>
                        </div>

                        <ChatInput
                            collection={queryRef.current}
                            bottomRef={bottomRef}
                            channelName={roomDetails?.data()?.name}
                            room={room}
                            setInputHeight={setInputHeight}
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