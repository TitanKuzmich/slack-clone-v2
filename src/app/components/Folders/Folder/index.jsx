import React from 'react'
import {useNavigate} from "react-router-dom"
import dayjs from "dayjs"

import Icon from "components/Icon"

import folderStyle from '../style.module.scss'
import icons from "assets/svg"

const Folder = ({folder}) => {
    const navigate = useNavigate()

    return (
        <div className={folderStyle.action_folder} onClick={() => {navigate(`/drive/${folder.id}`)}}>
            <Icon icon={icons.Folder} classIcon={folderStyle.action_folder_icon}/>
            <div className={folderStyle.action_folder_data}>
                <div>{folder.folderName}</div>
                {folder.createdAt && <p>{dayjs(folder.createdAt.toDate()).format("MM.DD.YYYY")}</p>}
            </div>
        </div>
    )
}

export default Folder