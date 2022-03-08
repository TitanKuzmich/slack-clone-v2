import { createReducer } from "redux-act"

import * as actions from "../actions/channels"

export const ROOT_FOLDER = {id: null, folderName: 'Root', path: []}

const defaultState = {
    isLoadingChannels: false,
    isLoadingDirects: false,
    channels: [],
    directs: [],
}

const channels = createReducer(
    {
        [actions.getChannelsListRequest.getType()](state) {
            return {
                ...state,
                isLoadingChannels: true
            }
        },
        [actions.getChannelsListSuccess.getType()](state, payload) {
            return {
                ...state,
                isLoadingChannels: false,
                channels: payload
            }
        },
        [actions.getChannelsListFail.getType()](state) {
            return {
                ...state,
                isLoadingChannels: false
            }
        },
        [actions.getDirectsListRequest.getType()](state) {
            return {
                ...state,
                isLoadingDirects: true
            }
        },
        [actions.getDirectsListSuccess.getType()](state, payload) {
            return {
                ...state,
                isLoadingDirects: false,
                channels: payload
            }
        },
        [actions.getDirectsListFail.getType()](state) {
            return {
                ...state,
                isLoadingDirects: false
            }
        }
    },
    defaultState
)

export default channels