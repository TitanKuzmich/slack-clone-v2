import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"
import Hotkeys from "react-hot-keys"
import {v4 as uuidV4} from "uuid"
import {Picker} from 'emoji-mart'
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db, storage} from "lib/firebase"
import Icon from "components/Icon"
import Info from "components/Info"
import ChatFile from "components/ChatArea/ChatFile"

import style from './style.module.scss'
import icons from "assets/svg"

const DEFAULT_DATA = {
    message: "",
    attachments: []
}

const MAX_ROWS_COUNT = 5

const ChatInput = ({collection, channelName, room, bottomRef, inputRef}) => {
    const [user] = useAuthState(auth)
    const textAreaRef = useRef(null)

    const [showEmoji, setShowEmoji] = useState(false)
    const [enableSend, setEnableSend] = useState(false)
    const [data, setData] = useState(DEFAULT_DATA)

    const onEmojiClick = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)

        setData({
            ...data,
            message: data.message + emoji
        })
    }

    const handleUpload = (e) => {
        const file = e.target.files[0]

        const id = uuidV4()
        const filePath = `/files/${user.uid}/messages_files/${file.name}`

        setData({
            ...data,
            attachments: [
                ...data.attachments,
                {
                    id: id,
                    name: file.name,
                    file: file,
                    progress: 0,
                    fileUrl: "",
                    fullPath: "",
                    error: false
                }
            ]
        })

        const uploadTask = storage
            .ref(filePath)
            .put(file)

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes

                setData(prevData => {
                    return {
                        ...prevData,
                        attachments: prevData.attachments.map(item => {
                            return item.id === id ? {...item, progress: progress} : item
                        })
                    }
                })
            },
            () => {
                setData(prevData => {
                    return {
                        ...prevData,
                        attachments: prevData.attachments.map(item => {
                            return item.id === id ? {...item, error: true} : item
                        })
                    }
                })
            },
            () => {
                uploadTask
                    .snapshot.ref
                    .getDownloadURL()
                    .then((url) => {

                        setData({
                            ...data,
                            attachments: [
                                ...data.attachments,
                                {
                                    id: id,
                                    name: file.name,
                                    file: file,
                                    fileUrl: url,
                                    progress: 1,
                                    fullPath: filePath
                                }
                            ]
                        })
                    })
            }
        )
    }

    const removeFile = (file) => {
        storage
            .ref(file.fullPath)
            .delete()
            .then(() => {
                setData(prevData => {
                    return {
                        ...prevData,
                        attachments: prevData.attachments.filter(item => {
                            return item.id !== file.id && item
                        })
                    }
                })
            })
    }

    const sendMessage = (shortcut) => {
        if (!room.roomId || !enableSend) return

        if (shortcut === 'command+enter' || shortcut === 'ctrl+enter') {
            if (data.message || data.attachments.length) {

                data.attachments.map(item => {
                    delete item.file
                    delete item.progress
                })

                collection
                    .add({
                        message: data.message,
                        attachments: data.attachments,
                        reactions: [],
                        replies: [],
                        timestamp: db.getCurrentTimestamp,
                        userId: user.uid,
                        user: user?.displayName,
                        userImage: user?.photoURL || ""
                    })
                    .then(() => {
                        bottomRef?.current?.scrollIntoView({behavior: "smooth"})
                    })
                setData(DEFAULT_DATA)
            }
        }
    }

    useEffect(() => {
        if(data.message && !data.attachments.length) setEnableSend(true)
        if(!data.message && !data.attachments.length) setEnableSend(false)

        if(data.attachments.length) {
            if(data.attachments.some(file => file.progress !== 1))
                setEnableSend(false)
            else
                setEnableSend(true)
        }
    }, [data])

    return (
        <div className={cn(style.chat_input)} ref={inputRef}>

            {showEmoji && (
                <Picker
                    emoji="point_up"
                    style={{
                        transformOrigin: "left bottom",
                        position: "absolute",
                        bottom: "74px",
                        left: "20px",
                    }}
                    onSelect={onEmojiClick}
                />
            )}

            <div>
                <Hotkeys
                    keyName="ctrl+enter, command+enter"
                    filter={(e) => {
                        if (e.key === 'Control'
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
                            textAreaRef?.current?.value.split(/\r|\n/ig).length <= MAX_ROWS_COUNT
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
                {data.attachments.length > 0 &&
                <div className={style.chat_input_files}>
                    {data.attachments?.map(file => {
                            return (
                                <ChatFile key={file.id} file={file} removeFile={removeFile}/>
                            )
                        }
                    )}
                </div>
                }
            </div>

            <div className={style.actions_wrapper}>
                <div className={style.actions_attachments}>
                    <div onClick={() => setShowEmoji(!showEmoji)}>
                        {/*<Hotkeys*/}
                        {/*    keyName="Escape"*/}
                        {/*    onKeyDown={() => setShowEmoji(false)}*/}
                        {/*>*/}
                        <Icon icon={icons.Smile} classIcon={cn(style.actions_icon, style.actions_icon__nostroke)}/>
                        {/*</Hotkeys>*/}
                    </div>

                    <label>
                        <Icon icon={icons.Attachment} classIcon={style.actions_icon}/>
                        <input
                            type="file"
                            onChange={handleUpload}
                            style={{opacity: 0, position: "absolute", left: "-9999px"}}
                        />
                    </label>

                    <Info
                        content={
                            <>
                                <p>You can send message via:</p>
                                <p>&bull; "Command+Enter"</p>
                                <p>&bull; "Ctrl+Enter"</p>
                            </>
                        }
                    />
                </div>

                <div className={style.actions_send} onClick={() => sendMessage('ctrl+enter')}>
                    <Icon icon={icons.Send} classIcon={cn(style.actions_icon, {
                        [style.actions_icon__disable]: !enableSend
                    })}/>
                </div>
            </div>
        </div>
    )
}

export default ChatInput