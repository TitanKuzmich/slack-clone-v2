import nextId from "react-id-generator"

import * as actions from "../actions/app"
import {db} from "lib/firebase"

// error types: "error" | "success" | "info"

export const newNotification = (payload) => (dispatch) => {
    const uuid = nextId()
    const minDuration = payload.message === "{global}" ? 10000 : 4000

    const messageLiveTime = Math.max(minDuration, payload.message.split(" ").length * 0.7 * 1000)

    dispatch(actions.newNotificationRequest({uuid, type: payload.type, message: payload.message}))

    setTimeout(() => {
        return dispatch(actions.removeNotificationRequest({uuid}))
    }, messageLiveTime)
}

export const removeNotification = (payload) => (dispatch) => {
    dispatch(actions.removeNotificationRequest({uuid: payload.uuid}))
}

export const getUserList = (currentUid) => async(dispatch) => {
    dispatch(actions.getUserListRequest())

    try {
        const response = await db
            .users
            .get()

        const users = response.docs.map(user => db.formatDoc(user))

        dispatch(actions.getUserListSuccess(users.filter(user => user.id !== currentUid)))

    } catch {
        dispatch(actions.getUserListFail())
    }
}