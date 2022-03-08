import React from 'react'

import Modal from "components/Modal"

import style from '../style.module.scss'

const DeleteModal = ({text, onConfirmAction, onCloseAction}) => {

    const header = () => {
        return (
            <span className={style.modal_header__text}>Confirm document folder</span>
        )
    }

    const content = () => {
        return (
            <span className={style.modal_content__text}>{text}</span>
        )
    }

    return (
        <Modal
            onConfirmAction={onConfirmAction}
            onCloseAction={onCloseAction}
            header={header}
            content={content}
        />
    )
}

export default DeleteModal