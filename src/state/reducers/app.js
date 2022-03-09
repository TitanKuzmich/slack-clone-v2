import { createReducer } from "redux-act"

import * as actions from "../actions/app"

const defaultState = {
    notifications: [],
    room: {},
    userList: [],
    isLoading: false
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
                room: {
                    roomId: payload.roomId,
                    channels: payload.channels
                }
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