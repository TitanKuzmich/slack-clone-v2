import React from 'react'
import dayjs from "dayjs"

import {getFileName} from "components/Folders/File/helper"
import Icon from "components/Icon"

import fileStyle from '../style.module.scss'
import icons from "assets/svg"

const File = ({file, setFile, setOpenPreviewFile}) => {

    const onPreview = () => {
        setFile(file)
        setOpenPreviewFile(true)
    }

    return (
        <div className={fileStyle.action_file} onClick={onPreview}>
            <Icon icon={icons.File} classIcon={fileStyle.action_file_icon}/>
            <div className={fileStyle.action_file_data}>
                <div>{getFileName(file.name)}</div>
                {file.createdAt && <p>{dayjs(file.createdAt.toDate()).format("MM.DD.YYYY")}</p>}
            </div>
        </div>
    )
}

export default File