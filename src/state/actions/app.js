import { createAction } from "redux-act"

export const newNotificationRequest = createAction("APP_NEW_NOTIFICATION")
export const removeNotificationRequest = createAction("APP_REMOVE_NOTIFICATION")

export const enterRoom = createAction("ENTER_ROOM")

export const getUserListRequest = createAction("GET_USER_LIST_REQUEST")
export const getUserListSuccess = createAction("GET_USER_LIST_SUCCESS")
export const getUserListFail = createAction("GET_USER_LIST_FAIL")
