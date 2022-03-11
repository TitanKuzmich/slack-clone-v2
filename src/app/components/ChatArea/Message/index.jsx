import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"
import Hotkeys from "react-hot-keys"
import {v4 as uuidV4} from "uuid"
import dayjs from "dayjs"
import {Picker} from "emoji-mart"
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db} from "lib/firebase"
import Icon from "components/Icon"
import ChatFile from "components/ChatArea/ChatFile"
import TitleWithAvatar from "components/TitleWithAvatar"

import style from './style.module.scss'
import icons from "assets/svg"
import {Oval} from "react-loader-spinner"

const MAX_ROWS_COUNT = 5

const Message = ({message, deleteMessage, collection}) => {
    const [user] = useAuthState(auth)

    const containerRef = useRef(null)
    const textAreaRef = useRef(null)

    const [messageText, setMessageText] = useState(message.message)
    const [editMessage, setEditMessage] = useState(false)
    const [showEditEmoji, setShowEditEmoji] = useState(false)
    const [isUpdating, setUpdating] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)
    const [styleForPicker, setStyleForPicker] = useState(false)

    const onEmojiClick = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)

        const id = uuidV4()

        let data = [{
            id: id,
            content: emoji,
            count: 1,
            usersIds: [user.uid]
        }]

        if (!message.reactions.length) {
            collection
                .doc(message.id)
                .update({
                    reactions: data
                }, {merge: true})

            return
        }

        const updatedReactions = message.reactions.some(reaction => reaction.content === emoji)
            ? message.reactions.map(reaction => {
                return reaction.content === emoji
                    ? {
                        id: reaction.id,
                        content: reaction.content,
                        count: reaction.usersIds.includes(user.uid) ? reaction.count - 1 : reaction.count + 1,
                        usersIds: reaction.usersIds.includes(user.uid) ? reaction.usersIds : [...reaction.usersIds, user.uid]
                    } : reaction
            }) : [...message.reactions, ...data]


        const removedWithZeroCount = updatedReactions.filter(reaction => reaction.count !== 0)

        collection
            .doc(message.id)
            .update({
                reactions: removedWithZeroCount
            }, {merge: true})
    }

    const onEmojiEditClick = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)

        setMessageText(messageText + emoji)
    }

    const updateMessage = (shortcut) => {
        if (shortcut === 'escape') {
            setEditMessage(false)
            setMessageText(message.message)
        }

        if (shortcut === 'command+enter' || shortcut === 'ctrl+enter') {
            setUpdating(true)
            collection
                .doc(message.id)
                .update({
                    message: messageText,
                    updatedAt: db.getCurrentTimestamp
                }, {merge: true})
                .then(() => {
                    setUpdating(false)
                    setEditMessage(false)
                    setMessageText(message.message)
                })
                .catch(() => {
                    setUpdating(false)
                    console.log("Something went wrong!")
                })
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef?.current && !containerRef?.current.contains(e.target)) {
                setShowEmoji(false)
                setShowEditEmoji(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [containerRef])

    useEffect(() => {
        if (containerRef && containerRef.current) {
            const docHeight = document.body.getBoundingClientRect().height
            const topPosition = containerRef.current.getBoundingClientRect().top

            if (topPosition > docHeight / 2) {
                setStyleForPicker(true)
            } else {
                setStyleForPicker(false)
            }
        }
    }, [showEmoji, containerRef?.current, containerRef?.current?.getBoundingClientRect().top])

    return (
        <div
            ref={containerRef}
            className={style.message_container}
        >

            {showEmoji && (
                <div
                    className={cn(style.emoji_picker, {
                        [style.emoji_picker__bottom]: !styleForPicker,
                        [style.emoji_picker__top]: styleForPicker
                    })}
                >
                    <Picker
                        emoji="point_up"
                        onSelect={onEmojiClick}
                    />
                </div>
            )}

            <div className={style.message_actions}>
                <div className={style.message_icon_wrapper}>
                    <Icon
                        icon={icons.AddReaction}
                        classIcon={cn(style.message_icon, style.message_icon__nostroke)}
                        onClick={() => setShowEmoji(!showEmoji)}
                    />
                </div>
                {/*<div className={style.message_icon_wrapper}>*/}
                {/*    <Icon icon={icons.Thread} classIcon={style.message_icon}/>*/}
                {/*</div>*/}
                {user.uid === message.userId && (
                    <>
                        <div className={style.message_icon_wrapper}>
                            <Icon
                                icon={icons.Edit}
                                classIcon={cn(style.message_icon, style.message_icon)}
                                onClick={() => setEditMessage(!editMessage)}
                            />
                        </div>
                        <div className={style.message_icon_wrapper}>
                            <Icon
                                icon={icons.Delete}
                                classIcon={cn(style.message_icon, style.message_icon__nostroke)}
                                onClick={() => deleteMessage(message.id)}
                            />
                        </div>
                    </>
                )}
            </div>

            <TitleWithAvatar.TitleWithAvatarWrap
                className={style.message_header}
                channels={false}
                photoURL={message.userImage}
                title={message.user}
            />

            {message.updatedAt ? (
                <p className={style.message_time}>
                    Edited at:{" "}
                    {dayjs(message.updatedAt?.toDate()).format("HH:mm")}{" "}
                    {dayjs(message.updatedAt?.toDate()).format("MM.DD.YYYY")}
                </p>
            ) : (
                <>
                    <p className={style.message_time}>
                        {dayjs(message.timestamp?.toDate()).format("HH:mm")}{" "}
                        {dayjs(message.timestamp?.toDate()).format("MM.DD.YYYY")}
                    </p>
                </>
            )}

            {message.message && !editMessage && (
                <div className={style.message_data}>
                    {message.message}
                </div>
            )}

            {editMessage && (
                <div className={cn(style.message_data, style.message_edit)}>
                    {showEditEmoji && (
                        <div
                            className={cn(style.emoji_picker, style.emoji_edit, {
                                [style.emoji_edit__bottom]: !styleForPicker,
                                [style.emoji_edit__top]: styleForPicker
                            })}
                        >
                            <Picker
                                emoji="point_up"
                                onSelect={onEmojiEditClick}
                            />
                        </div>
                    )}

                    <div>
                        <Hotkeys
                            keyName="ctrl+enter, command+enter, escape"
                            filter={(e) => {
                                if (e.key === 'Escape'
                                    || e.key === 'Command'
                                    || e.key === 'Ctrl'
                                ) {
                                    e.preventDefault()
                                }
                                return true
                            }}
                            onKeyDown={updateMessage}
                        >
                            <textarea
                                ref={textAreaRef}
                                rows={
                                    textAreaRef?.current?.value.split(/\r|\n/ig).length <= MAX_ROWS_COUNT
                                        ? textAreaRef?.current?.value.split(/\r|\n/ig).length
                                        : MAX_ROWS_COUNT
                                }
                                className={style.message_edit_area}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                        </Hotkeys>
                    </div>

                    <div className={style.actions_wrapper}>
                        <Icon
                            icon={icons.Smile}
                            classIcon={style.actions_icon}
                            onClick={() => setShowEditEmoji(!showEditEmoji)}
                        />

                        <div className={style.actions_buttons}>
                            <div className={style.actions_cancel} onClick={() => setEditMessage(false)}>
                                Cancel
                            </div>

                            <div
                                className={cn(style.actions_send, {
                                    [style.actions_send__disabled]: !messageText || messageText === message.message
                                })}
                                onClick={
                                    messageText
                                        ? () => updateMessage('ctrl+enter')
                                        : () => {
                                        }
                                }
                            >
                                {isUpdating
                                    ? <Oval
                                        color="#f8f8f8" height={13} width={13}
                                    />
                                    : <span>Submit</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {message.attachments.length > 0 &&
            <div className={style.message_files}>
                {message.attachments.map(file => {
                        return (
                            <ChatFile
                                fileNameLength={10}
                                key={file.id}
                                file={file}
                                removeFile={() => {
                                }} noRemove/>
                        )
                    }
                )}
            </div>
            }

            {message.reactions.length > 0 && (
                <div className={style.message_reaction_wrapper}>
                    {message.reactions.map(reaction => (
                        <div key={reaction.id} className={style.message_reaction}>
                            {reaction.content}
                            <span className={style.message_reaction_count}>{reaction.count}</span>
                        </div>
                    ))}
                </div>
            )}

            {message.replies.length > 0 && (
                <div className={style.message_reply_wrapper}>
                    {message.replies.length} repl{message.replies.length > 1 ? "ies" : "y"}
                </div>
            )}
        </div>
    )
}

export default Message