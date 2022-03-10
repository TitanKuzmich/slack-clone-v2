import React from 'react'
import cn from "classnames"
import {useId} from "react-id-generator"
import {Oval} from "react-loader-spinner"

import {getFileName} from "lib/helpers"
import Icon from "components/Icon"

import style from './style.module.scss'
import icons from "assets/svg"

const ChatFile = ({file, removeFile}) => {

    return (
        <div
            key={useId()}
            className={cn(style.uploaded_file, {[style.uploaded_file__done]: file.progress === 1})}
        >
            <p>
                {getFileName(file.name, 13)}
            </p>
            {file.progress === 1
                ? <Icon
                    icon={icons.Delete}
                    classIcon={style.icon_delete}
                    onClick={() => removeFile(file)}
                />
                : <Oval color="#3f0f40" height={20} width={20}/>
            }
        </div>
    )
}

export default ChatFile