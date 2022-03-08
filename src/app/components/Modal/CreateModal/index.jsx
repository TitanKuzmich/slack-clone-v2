import React, {useEffect, useState} from 'react'
import nextId from "react-id-generator"
import {useDispatch, useSelector} from "react-redux"
import {useAuthState} from "react-firebase-hooks/auth"
import {Oval} from "react-loader-spinner"

import {auth} from "lib/firebase"
import {getUserList} from "state/dispatchers/app"
import Modal from "components/Modal"
import RadioGroup from "components/Radio/Group"
import Checkbox from "components/Checkbox"

import style from '../style.module.scss'

const radioGroupItems = [
    {value: false, label: "Public"},
    {value: true, label: "Private"}
]

const CreateModal = ({onConfirmAction, onCloseAction, headerName, data, setData, channels}) => {
    const [user] = useAuthState(auth)
    const dispatch = useDispatch()

    const {userList, isLoading} = useSelector(state => state.app)
    const {isLoadingChannels, isLoadingDirects} = useSelector(state => state.channels)

    const onUserIdAdd = (_, userId) => {
        let usersIds = data.usersIds

        usersIds = !data.usersIds.includes(userId) ? [...usersIds, userId] : usersIds.filter(id => id !== userId)

        setData({
            ...data,
            usersIds
        })
    }

    useEffect(() => {
        data.private && dispatch(getUserList(user.uid))
    }, [data.private])

    useEffect(() => {
        return () => {
            console.log("rerender")
        }
    })

    const header = () => {
        return (
            <span className={style.modal_header__text}>Create New {headerName}</span>
        )
    }

    const content = () => {
        return (
            <>
                <div className={style.modal_content__input}>
                    <input
                        placeholder={`Enter ${headerName} name`}
                        value={data.name}
                        onChange={(e) => {
                            setData({
                                ...data,
                                name: e.target.value
                            })
                        }}
                        type="text"
                    />
                </div>
                {channels && (
                    <div className={style.modal_content__radio}>
                        <span>Choose channel type</span>
                        <RadioGroup
                            value={data.private}
                            onChange={option => {
                                setData({
                                    ...data,
                                    private: option.value
                                })
                            }}
                            items={radioGroupItems}
                        />
                    </div>
                )}

                {(data.private || !channels) &&
                <div className={style.modal_content__list}>
                    {isLoading ? (
                        <div className="loading_wrapper">
                            <Oval color="#33A852" height={20} width={20}/>
                        </div>
                    ) : (
                        <>
                            <span>Choose users:</span>
                            {userList.map(user => (
                                <div key={nextId()}>
                                    <Checkbox
                                        label={user.name}
                                        data={user}
                                        checked={data.usersIds.includes(user.uid)}
                                        onChange={(checked, userId) => onUserIdAdd(checked, userId)}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {!isLoading && !userList.length > 0 && (
                        <p>There aren't any users:)</p>
                    )}
                </div>
                }
            </>
        )
    }

    return (
        <Modal
            isLoading={isLoadingDirects || isLoadingChannels}
            onConfirmAction={onConfirmAction}
            onCloseAction={onCloseAction}
            header={header}
            content={content}
        />
    )
}

export default CreateModal