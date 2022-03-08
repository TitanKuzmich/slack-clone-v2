import * as actions from "../actions/channels"
import {db} from "lib/firebase"

export const getChannelsList = () => async (dispatch) => {
    dispatch(actions.getChannelsListRequest())

    try {
        const response = await db
            .channels
            .get()

        const channels = response.docs.map(channel => db.formatDoc(channel))

        dispatch(actions.getChannelsListSuccess(channels))

    } catch {
        dispatch(actions.getChannelsListFail())
    }
}

export const getDirectsList = () => async (dispatch) => {
    dispatch(actions.getDirectsListRequest())

    try {
        const response = await db
            .channels
            .get()

        const channels = response.docs.map(channel => db.formatDoc(channel))

        dispatch(actions.getDirectsListSuccess(channels))

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
            dispatch(getChannelsList())
        } else {
            dispatch(getDirectsList())
        }

        onClose()
    } catch {
        console.log("something went wrong")
    }
}

