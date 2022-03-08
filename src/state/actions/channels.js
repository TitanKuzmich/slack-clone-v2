import { createAction } from "redux-act"

export const getChannelsListRequest = createAction("GET_CHANNELS_LIST_REQUEST")
export const getChannelsListSuccess = createAction("GET_CHANNELS_LIST_SUCCESS")
export const getChannelsListFail = createAction("GET_CHANNELS_LIST_FAIL")

export const getDirectsListRequest = createAction("GET_DIRECTS_LIST_REQUEST")
export const getDirectsListSuccess = createAction("GET_DIRECTS_LIST_SUCCESS")
export const getDirectsListFail = createAction("GET_DIRECTS_LIST_FAIL")

