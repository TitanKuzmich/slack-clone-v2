import React, {useState} from 'react'
import {v4 as uuidV4} from 'uuid'
import cn from "classnames"
import nextId from "react-id-generator"
import {Oval} from "react-loader-spinner"
import {useAuthState} from "react-firebase-hooks/auth"

import {auth, db, storage} from "lib/firebase"
import Modal from "components/Modal"
import Icon from "components/Icon"

import style from '../style.module.scss'
import icons from "assets/svg"

const UploadFileModal = ({
                             data,
                             setData,
                             setConfirmUpload,
                             onCloseAction
                         }) => {
    const [user] = useAuthState(auth)

    const [enableConfirm, setEnableConfirm] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState([])

    const handleUpload = (e) => {
        const file = e.target.files[0]
        if (!currentFolder || !file) return

        const id = uuidV4()
        setUploadingFiles(preventUploadingFiles => [
            ...preventUploadingFiles,
            {
                id: id,
                name: file.name,
                progress: 0,
                fullPath: "",
                error: false
            }
        ])

        const filePath =
            currentFolder === ROOT_FOLDER
                ? `${currentFolder.path.join('/')}`
                : `${currentFolder.path.join('/')}/${currentFolder.folderName}`

        const uploadTask = storage
            .ref(`/files/${user.uid}/${filePath}/${file.name}`)
            .put(file)

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes
                const fullPath = snapshot.ref.fullPath
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadFile => {
                        if (uploadFile.id === id) {
                            return {
                                ...uploadFile,
                                progress: progress,
                                fullPath: fullPath
                            }
                        }

                        return uploadFile
                    })
                })
            },
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadFile => {
                        if (uploadFile.id === id) {
                            return {...uploadFile, error: true}
                        }
                        return uploadFile
                    })
                })
            },
            () => {
                uploadTask
                    .snapshot.ref
                    .getDownloadURL()
                    .then((url) => {
                        setEnableConfirm(true)
                        const newFiles = [...data, {
                            file: file,
                            fileUrl: url,
                            fileFullPath: `/files/${user.uid}/${filePath}/${file.name}`
                        }]

                        setData(newFiles)
                    })
            }
        )
    }

    const removeFile = (file) => {
        storage
            .ref(file.fullPath)
            .delete()
            .then(() => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                        return uploadFile.id !== file.id && uploadFile
                    })
                })
                setData(prevData => {
                    return prevData.filter(uploadFile => {
                        return uploadFile.file.id !== file.id && uploadFile
                    })
                })
            })
    }

    const header = () => {
        return (
            <span className={style.modal_header__text}>Upload File</span>
        )
    }

    const content = () => {
        return (
            <>
                <label className={style.modal_content__upload}>
                    Choose file
                    <input
                        onChange={handleUpload}
                        type="file"
                        hidden
                    />
                </label>

                {uploadingFiles.length > 0 && (
                    <div className={style.uploaded_files}>
                        {uploadingFiles.map(file => (
                            <div
                                key={nextId()}
                                className={cn(style.uploaded_file, {[style.uploaded_file__done]: file.progress === 1})}
                            >
                                <p>
                                    {getFileName(file.name, 13)}
                                </p>
                                {file.progress === 1
                                    ? <Icon
                                        icon={icons.Delete}
                                        classIcon={style.uploaded_file_delete}
                                        onClick={() => removeFile(file)}
                                    />
                                    : <Oval color="#33A852" height={20} width={20}/>
                                }
                            </div>
                        ))}
                    </div>
                )

                }
            </>
        )
    }

    return (
        <Modal
            enableConfirm={enableConfirm}
            onConfirmAction={() => setConfirmUpload(true)}
            onCloseAction={onCloseAction}
            header={header}
            content={content}
        />
    )
}

export default UploadFileModal