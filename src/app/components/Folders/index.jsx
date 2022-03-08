import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useAuthState} from "react-firebase-hooks/auth"
import {useParams} from "react-router-dom"

import * as actions from "state/actions/channels"
import {ROOT_FOLDER} from "state/reducers/channels"
import {auth, db, storage} from "lib/firebase"
import Icon from "components/Icon"
import FolderBreadcrumbs from "components/FolderBreadcrumbs"
import CreateFolderModal from "components/Modal/CreateModal"
import UploadFileModal from "components/Modal/UploadFileModal"
import PreviewFileModal from "components/Modal/PreviewFileModal"
import Folder from "components/Folders/Folder"
import File from "components/Folders/File"

import style from './style.module.scss'
import icons from 'assets/svg'

const Folders = () => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()
    const {currentFolder} = useSelector(state => state.folders)

    const {folderId} = useParams()

    const [isOpenCreateFolder, setOpenCreateFolder] = useState(false)
    const [isOpenUploadFile, setOpenUploadFile] = useState(false)
    const [isOpenPreviewFile, setOpenPreviewFile] = useState(false)

    const [folderName, setFolderName] = useState('')
    const [data, setData] = useState([])
    const [confirmUpload, setConfirmUpload] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [file, setFile] = useState({})

    const createFolder = () => {
        if (currentFolder == null) return

        const path = [...currentFolder.folder.path]
        if (currentFolder.folder !== ROOT_FOLDER) {
            path.push({folderName: currentFolder.folder.folderName, id: currentFolder.folder.id})
        }

        db
            .folders
            .add({
                userId: user.uid,
                folderName: folderName,
                parentId: folderId || null,
                path: path,
                createdAt: db.getCurrentTimestamp

            })
            .then(() => {
                setFolderName('')
                setOpenCreateFolder(false)
            })
    }

    const closeUploadModal = () => {
        if(!uploaded) {
            Promise.all(data.map(item => {
                return storage
                    .ref(item.fileFullPath)
                    .delete()
            }))
                .then(() =>{
                    setUploaded(true)
                    setConfirmUpload(false)
                    setData([])
                    setOpenUploadFile(false)
                })
        }

        setOpenUploadFile(false)
    }

    const uploadFile = () => {
        if (!confirmUpload) return

        Promise.all(data.map(item => {
            return db.files
                .where("name", "==", item.file.name)
                .where("userId", "==", user.uid)
                .where("folderId", "==", currentFolder.folder.id)
                .get()
                .then(existingFiles => {
                    const existingFile = existingFiles.docs[0]
                    if (existingFile) {
                        existingFile.ref.update({url: item.fileUrl})
                    } else {
                        db
                            .files
                            .add({
                                url: item.fileUrl,
                                name: item.file.name,
                                createdAt: db.getCurrentTimestamp,
                                folderId: currentFolder.folder.id,
                                userId: user.uid
                            })
                            .then(() => setData([]))
                    }
                })
        }))
            .then(() => {
                setUploaded(true)
                setConfirmUpload(false)
                setData([])
                setOpenUploadFile(false)
            })
            .catch(e => console.log(e.message))
    }

    useEffect(() => {
        dispatch(actions.selectFolder({
            id: folderId || null,
            folder: currentFolder.folder
        }))
    }, [folderId, currentFolder.folder])

    useEffect(async () => {
        if (!folderId) return dispatch(actions.updateFolder())

        await db.folders
            .doc(folderId)
            .get()
            .then(doc => {
                dispatch(actions.updateFolder(db.formatDoc(doc)))
            })
            .catch(() => dispatch(actions.updateFolder()))
    }, [folderId])

    useEffect(() => {
        return db.folders
            .where('parentId', '==', folderId || null)
            .where('userId', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(snapshot => {
                dispatch(actions.setChildFolders(snapshot.docs.map(db.formatDoc)))
            })
    }, [folderId, user])

    useEffect(() => {
        return db.files
            .where('folderId', '==', folderId || null)
            .where('userId', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(snapshot => {
                dispatch(actions.setChildFiles(snapshot.docs.map(db.formatDoc)))
            })
    }, [folderId, user])

    useEffect(() => {
        uploadFile()
    }, [confirmUpload])

    useEffect(() => {
        console.log(isOpenUploadFile)
    }, [isOpenUploadFile])

    return (
        <div className={style.content_wrapper}>
            {isOpenCreateFolder && (
                <CreateFolderModal
                    onConfirmAction={createFolder}
                    onCloseAction={() => setOpenCreateFolder(false)}
                    name={folderName}
                    setName={setFolderName}
                />
            )}

            {isOpenUploadFile && (
                <UploadFileModal
                    fileLink={file}
                    currentFolder={currentFolder.folder}
                    data={data}
                    setData={setData}
                    setConfirmUpload={setConfirmUpload}
                    onConfirmAction={uploadFile}
                    onCloseAction={closeUploadModal}
                />
            )}

            {isOpenPreviewFile && (
                <PreviewFileModal
                    file={file}
                    onCloseAction={() => setOpenPreviewFile(false)}
                />
            )}

            <div className={style.content_header}>
                <FolderBreadcrumbs currentFolder={currentFolder.folder}/>

                <div className={style.content_actions}>
                    <div
                        className={style.icon_wrapper}
                        onClick={() => setOpenUploadFile(true)}
                    >
                        <Icon className={style.action_icon} icon={icons.UploadFile}/>
                    </div>
                    <div
                        className={style.icon_wrapper}
                        onClick={() => setOpenCreateFolder(true)}
                    >
                        <Icon className={style.action_icon} icon={icons.UploadFolder}/>
                    </div>
                </div>
            </div>

            <div className={style.content_folders}>
                {currentFolder.childFolders.length > 0 && (
                    <div className={style.content_folders_wrapper}>
                        {currentFolder.childFolders.map(childFolder => (
                            <Folder key={childFolder.id} folder={childFolder}/>
                        ))}
                    </div>
                )}

                {currentFolder.childFolders.length > 0
                && currentFolder.childFiles.length > 0 && (
                    <div className={style.content_divider}/>
                )}

                {currentFolder.childFiles.length > 0 && (
                    <div className={style.content_files_wrapper}>
                        {currentFolder.childFiles.map(childFile => (
                            <File
                                key={childFile.id}
                                file={childFile}
                                setFile={setFile}
                                setOpenPreviewFile={setOpenPreviewFile}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Folders
