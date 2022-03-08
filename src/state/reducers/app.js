import { createReducer } from "redux-act"

import * as actions from "../actions/app"

const defaultState = {
    notifications: [],
    roomId: null,
    userList: [],
    isLoading: null
}

const app = createReducer(
    {
        [actions.newNotificationRequest.getType()](state, payload) {
            return {
                ...state,
                notifications: [...state.notifications, payload]
            }
        },
        [actions.removeNotificationRequest.getType()](state, payload) {
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.uuid !== payload.uuid)
            }
        },
        [actions.enterRoom.getType()](state, payload) {
            return {
                ...state,
                roomId: payload.roomId
            }
        },
        [actions.getUserListRequest.getType()](state) {
            return {
                ...state,
                isLoading: true
            }
        },
        [actions.getUserListSuccess.getType()](state, payload) {
            return {
                ...state,
                userList: payload,
                isLoading: false
            }
        },
        [actions.getUserListFail.getType()](state) {
            return {
                ...state,
                isLoading: false
            }
        }
    },
    defaultState
)

export default app