import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"
import {Picker} from 'emoji-mart'
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db} from "lib/firebase"
import Icon from "components/Icon"
import {
    CALCULATED_TEXT_AREA_HEIGHT,
    MAX_ROWS_COUNT,
    MAX_TEXT_AREA_HEIGHT,
    MIN_ROWS_COUNT
} from "components/ChatArea/helper"

import style from './style.module.scss'
import icons from "assets/svg"

const ChatInput = ({collection, channelName, room, bottomRef, setRowsCount}) => {
    const [user] = useAuthState(auth)
    const textAreaRef = useRef(null)

    const [value, setValue] = useState("")
    const [showEmoji, setShowEmoji] = useState(false)

    const onEmojiClick = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)

        console.log(emoji)
        setValue(value + emoji)
    }

    const sendMessage = () => {
        if (!room.roomId) return

        collection
            .add({
                message: value,
                replies: [],
                attachments: [],
                reactions: [],
                timestamp: db.getCurrentTimestamp(),
                user: user?.displayName,
                userImage: user?.photoURL
                    || "https://flyclipart.com/thumb2/user-icon-png-pnglogocom-133466.png"
            })
            .then(() => {
                bottomRef?.current?.scrollIntoView({behavior: "smooth"})
            })
        setValue("")
    }

    const onEnterKeyPress = (e) => {
        const charCode = e.keyCode

        // if (charCode === 13) {
        //     sendMessage()
        // }
    }

    useEffect(() => {
        setRowsCount(textAreaRef?.current?.value.split("\n").length)
    }, [textAreaRef?.current?.value.split("\n").length])

    return (
        <div className={style.chat_input}>
            <div
                style={{
                    maxHeight: `${textAreaRef?.current?.value.split("\n").length <= MAX_ROWS_COUNT
                        ? (
                            textAreaRef?.current?.value.split("\n").length === MIN_ROWS_COUNT
                                ? CALCULATED_TEXT_AREA_HEIGHT
                                : textAreaRef?.current?.scrollHeight
                        ) : MAX_TEXT_AREA_HEIGHT}px`
                }}
            >
                {showEmoji && (
                    <Picker
                        emoji="point_up"
                        style={{
                            transformOrigin: "left bottom",
                            position: "absolute",
                            bottom: "74",
                            left: "20px",
                        }}
                        onSelect={onEmojiClick}
                    />
                )}

                <textarea
                    ref={textAreaRef}
                    rows={
                        textAreaRef?.current?.value.split("\n").length <= MAX_ROWS_COUNT
                            ? textAreaRef?.current?.value.split("\n").length
                            : MAX_ROWS_COUNT
                    }
                    className={style.chat_input_area}
                    placeholder={`Send a message to a '${channelName}'`}
                    value={value}
                    onKeyDown={onEnterKeyPress}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <div className={style.actions_wrapper}>
                <div className={style.actions_attachments}>
                    <div onClick={() => setShowEmoji(!showEmoji)}>
                        <Icon icon={icons.Smile} classIcon={cn(style.actions_icon, style.emoji_icon)}/>
                    </div>
                    <Icon icon={icons.Attachment} classIcon={style.actions_icon}/>
                </div>

                <div className={style.actions_send} onClick={sendMessage}>
                    <Icon icon={icons.Send} classIcon={style.actions_icon}/>
                </div>
            </div>
        </div>
    )
}

export default ChatInput