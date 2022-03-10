import React, {useState} from 'react'
import cn from "classnames"
import dayjs from "dayjs"
import {useAuthState} from "react-firebase-hooks/auth"

import {auth} from "lib/firebase"
import Icon from "components/Icon"
import ChatFile from "components/ChatArea/ChatFile"
import TitleWithAvatar from "components/TitleWithAvatar"

import style from './style.module.scss'
import icons from "assets/svg"

const Message = ({message, deleteMessage}) => {
    const [user] = useAuthState(auth)
    const [mouseOver, setMouseOver] = useState(true)

    return (
        <div
            className={style.message_container}
            onFocus={() => setMouseOver(true)}
            onMouseOver={() => setMouseOver(true)}
            onMouseOut={() => setMouseOver(false)}
        >

            {/*{mouseOver && (*/}
                <div
                    className={style.message_actions}
                    onFocus={() => setMouseOver(true)}
                    onMouseOver={() => setMouseOver(true)}
                    onMouseOut={() => setMouseOver(false)}
                >
                    <div className={style.message_icon_wrapper}>
                        <Icon icon={icons.AddReaction}
                              classIcon={cn(style.message_icon, style.message_icon__nostroke)}/>
                    </div>
                    <div className={style.message_icon_wrapper}>
                        <Icon icon={icons.Thread} classIcon={style.message_icon}/>
                    </div>
                    {user.uid === message.userId && (
                        <div className={style.message_icon_wrapper}>
                            <Icon
                                icon={icons.Delete}
                                classIcon={cn(style.message_icon, style.message_icon__nostroke)}
                                onClick={() => deleteMessage(message.id)}
                            />
                        </div>
                    )}
                </div>
            {/*)}*/}

            <TitleWithAvatar.TitleWithAvatarWrap
                className={style.message_header}
                channels={false}
                photoURL={message.userImage}
                title={message.user}
            />

            <p className={style.message_time}>
                {dayjs(message.timestamp?.toDate()).format("HH:mm")}{" "}
                {dayjs(message.timestamp?.toDate()).format("MM.DD.YYYY")}
            </p>

            {message.message && (
                <span className={style.message_data}>
                    {message.message}
                </span>
            )}

            {message.attachments.length > 0 &&
            <div className={style.message_files}>
                {message.attachments.map(file => {
                        return (
                            <ChatFile
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