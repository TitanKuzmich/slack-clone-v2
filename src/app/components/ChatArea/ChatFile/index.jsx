import React from 'react'
import cn from "classnames"
import {Oval} from "react-loader-spinner"

import {getFileName} from "lib/helpers"
import Icon from "components/Icon"

import style from './style.module.scss'
import icons from "assets/svg"

const ChatFile = ({file, removeFile}) => {
    return (
        <div
            className={cn(style.uploaded_file, {
                [style.uploaded_file__done]: file.progress === 1
            })}
        >
            <a href={file.fileUrl || '#'} target='_blank' rel='noopener noreferrer'>
                {getFileName(file.name, 9)}
            </a>

            {file.progress === 1
                ? <Icon
                    icon={icons.Delete}
                    classIcon={style.icon_delete}
                    onClick={() => removeFile(file)}
                />
                : <Oval color="#3f0f40" height={14} width={14}/>
            }
        </div>
    )
}

export default ChatFile