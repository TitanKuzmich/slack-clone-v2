import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"
import Hotkeys from "react-hot-keys"
import ReactTooltip from "react-tooltip"
import {useId} from "react-id-generator"
import {Picker} from 'emoji-mart'
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db} from "lib/firebase"
import Icon from "components/Icon"
import Info from "components/Info"
import {
    CALCULATED_TEXT_AREA_HEIGHT,
    MAX_ROWS_COUNT,
    MAX_TEXT_AREA_HEIGHT,
    MIN_ROWS_COUNT
} from "components/ChatArea/helper"

import style from './style.module.scss'
import icons from "assets/svg"

const DEFAULT_DATA = {
    message: "",
    attachments: []

}

const ChatInput = ({collection, channelName, room, bottomRef, setRowsCount}) => {
    const [user] = useAuthState(auth)
    const textAreaRef = useRef(null)
    const [htmlId] = useId()

    const tooltipId = `send-tooltip-${htmlId}`

    const [mouseOver, setMouseOver] = useState(true)
    const [showEmoji, setShowEmoji] = useState(false)
    const [data, setData] = useState(DEFAULT_DATA)


    const onEmojiClick = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)

        setData({
            ...data,
            message: value + emoji
        })
    }

    const sendMessage = (shortcut) => {
        if (!room.roomId) return

        if(shortcut === 'command+enter'
            || shortcut === 'control+enter'
            || shortcut === 'ctrl+enter'
        ) {
            if((!data.message && !data.attachments) || !data.message) {
                console.log("no data")
                return
            }

            console.log(data)
            // collection
            //     .add({
            //         message: data.message,
            //         replies: [],
            //         attachments: data.attachments,
            //         reactions: [],
            //         timestamp: db.getCurrentTimestamp(),
            //         user: user?.displayName,
            //         userImage: user?.photoURL || ""
            //     })
            //     .then(() => {
            //         bottomRef?.current?.scrollIntoView({behavior: "smooth"})
            //     })
            setData(DEFAULT_DATA)
        }
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

                <Hotkeys
                    keyName="ctrl+enter, control+enter, command+enter"
                    filter={(e) => {
                        if(e.key === 'Control'
                            || e.key === 'Command'
                            || e.key === 'Ctrl'
                        ) {
                            e.preventDefault()
                        }
                        return true
                    }}
                    onKeyDown={sendMessage}
                >
                    <textarea
                        ref={textAreaRef}
                        rows={
                            textAreaRef?.current?.value.split("\n").length <= MAX_ROWS_COUNT
                                ? textAreaRef?.current?.value.split("\n").length
                                : MAX_ROWS_COUNT
                        }
                        className={style.chat_input_area}
                        placeholder={`Send a message to a '${channelName}'`}
                        value={data.message}
                        onChange={(e) => setData({
                            ...data,
                            message: e.target.value
                        })}
                    />
                </Hotkeys>
            </div>

            <div className={style.actions_wrapper}>
                <div className={style.actions_attachments}>
                    <div onClick={() => setShowEmoji(!showEmoji)}>
                        <Icon icon={icons.Smile} classIcon={cn(style.actions_icon, style.actions_icon__nostroke)}/>
                    </div>
                    <div>
                        <Icon icon={icons.Attachment} classIcon={style.actions_icon}/>
                    </div>
                    <Info
                        content={
                            <>
                                <p>You can send message via: </p>
                                <p>&bull; "Control+Enter"</p>
                                <p>&bull; "Command+Enter"</p>
                                <p>&bull; "Ctrl+Enter"</p>
                            </>
                        }
                    />
                </div>

                <div className={style.actions_send} onClick={() => sendMessage('ctrl+enter')}>
                    <Icon icon={icons.Send} classIcon={style.actions_icon}/>
                </div>
            </div>
        </div>
    )
}

export default ChatInput