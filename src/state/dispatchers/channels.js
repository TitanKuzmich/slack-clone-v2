import * as actions from "../actions/channels"
import {db} from "lib/firebase"

export const getChannelsList = (id) => async (dispatch) => {
    dispatch(actions.getChannelsListRequest())

    try {
        const responsePrivate = await db
            .channels
            .where('usersIds', 'array-contains', id)
            .where('private', '==', true)
            .get()
        const responsePublic = await db
            .channels
            .where('private', '==', false)
            .get()

        const privateChannels = responsePrivate.docs.map(channel => db.formatDoc(channel))
        const publicChannels = responsePublic.docs.map(channel => db.formatDoc(channel))

        dispatch(actions.getChannelsListSuccess([...privateChannels, ...publicChannels]))

    } catch {
        dispatch(actions.getChannelsListFail())
    }
}

export const getDirectsList = (id) => async (dispatch) => {
    dispatch(actions.getDirectsListRequest())

    try {
        const response = await db
            .directs
            .where('usersIds', 'array-contains', id)
            .get()

        const directs = response.docs.map(direct => db.formatDoc(direct))

        dispatch(actions.getDirectsListSuccess(directs))

    } catch {
        dispatch(actions.getDirectsListFail())
    }
}

export const createRoom = (data, channels, onClose) => async (dispatch) => {
    if (channels) {
        dispatch(actions.getChannelsListRequest())
    } else {
        dispatch(actions.getDirectsListRequest())
    }

    try {
        channels
            ? await db
                .channels
                .add(data)
            : await db
                .directs
                .add(data)

        if (channels) {
            dispatch(getChannelsList(data.creator))
        } else {
            dispatch(getDirectsList(data.creator))
        }

        onClose()
    } catch {
        console.log("something went wrong")
    }
}

