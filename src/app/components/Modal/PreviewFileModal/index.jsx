import React, {useEffect, useRef, useState} from 'react'
import cn from "classnames"

import {getFileName} from "components/Folders/File/helper"
import Modal from "components/Modal"
import Icon from "components/Icon"

import style from '../style.module.scss'
import icons from "assets/svg"

const PreviewFileModal = ({onCloseAction, file}) => {

    const imageRef = useRef(null)
    const [isLoading, setLoading] = useState(false)

    const imageLoad = (src) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', resolve);
            image.addEventListener('error', reject);
            image.src = src;
        });
    }

    useEffect(() => {
        setLoading(true)
        imageLoad(file.url).then(() => {
            setLoading(false)
            imageRef.current.style.background = `url(${file.url}) center / contain no-repeat`
        })
    }, [])

    const header = () => {
        return (
            <span className={style.modal_header__text}>File Preview</span>
        )
    }

    const content = () => {
        return (
            <div className={style.modal_content__preview}>
                <div className={style.modal_content__info}>
                    <p>{getFileName(file.name)}</p>
                    <div className={style.icons_wrapper}>
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={style.icon_wrapper}
                        >
                            <Icon icon={icons.Preview} classIcon={style.action_icon}/>
                        </a>
                        <a
                            href={file.url}
                            className={style.icon_wrapper}
                            target="_blank"
                            rel="noreferrer noopener"
                            download
                        >
                            <Icon icon={icons.Download} classIcon={cn(style.action_icon, style.download_icon)}/>
                        </a>
                    </div>
                </div>

                <div
                    className={cn(style.image, {[style.loading]: isLoading})}
                    ref={imageRef}
                />
            </div>
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

export default PreviewFileModal