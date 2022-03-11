import React from 'react'
import cn from "classnames"
import {Oval} from "react-loader-spinner"

import {getFileName} from "lib/helpers"
import Icon from "components/Icon"

import style from './style.module.scss'
import icons from "assets/svg"

const ChatFile = ({file, removeFile, noRemove = false, fileNameLength = 9}) => {
    return (
        <div
            className={cn(style.uploaded_file, {
                [style.uploaded_file__done]: file.progress ? file.progress === 1 : noRemove
            })}
        >
            <a href={file.fileUrl || '#'} target='_blank' rel='noopener noreferrer'>
                {getFileName(file.name, fileNameLength)}
            </a>

            {!noRemove && (
                <>
                    {file.progress === 1
                        ? <Icon
                            icon={icons.Delete}
                            classIcon={style.icon_delete}
                            onClick={() => removeFile(file)}
                        />
                        : <Oval color="#3f0f40" height={14} width={14}/>
                    }
                </>
            )}
        </div>
    )
}

export default ChatFile