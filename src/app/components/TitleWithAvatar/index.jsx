import React, {useEffect} from 'react'
import cn from "classnames"

import style from "./style.module.scss"

const TitleWithAvatarNoWrap = ({channels, photoURL, title}) => {

    return (
        <>
            {channels ? (
                <>
                    <span className={style.title_avatar_span}>#</span>
                    <h3 className={style.title_avatar_title}>{title}</h3>
                </>
            ) : (
                <>
                    {photoURL ? (
                        <>
                            <img
                                className={style.title_avatar_img}
                                src={photoURL}
                                alt="Preview"
                            />
                            <h3 className={style.title_avatar_title}>{title}</h3>
                        </>
                    ) : (
                        <>
                            <div className={style.title_avatar_avatar}>
                                {title?.slice(0, 2)}
                            </div>
                            <h3 className={style.title_avatar_title}>{title}</h3>
                        </>
                    )}
                </>
            )}
        </>
    )
}

const TitleWithAvatarWrap = ({channels, photoURL, title, className}) => {
    return (
        <div className={cn(style.title_avatar_wrapper, className)}>
            <TitleWithAvatarNoWrap
                channels={channels}
                photoURL={photoURL}
                title={title}
            />
        </div>
    )
}

const TitleWithAvatar = {
    TitleWithAvatarNoWrap,
    TitleWithAvatarWrap
}

export default TitleWithAvatar