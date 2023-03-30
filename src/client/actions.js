export const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG";
export const CREATE_ROOM_REQUEST = "CREATE_ROOM_REQUEST";
export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS";
export const CREATE_ROOM_ERROR = "CREATE_ROOM_ERROR";
export const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR";
export const SET_USERNAME = "SET_USERNAME";

export function createRoomRequest() {
    return {
        type: CREATE_ROOM_REQUEST
    }
}

export function createRoomSuccess(payload) {
    return {
        type: CREATE_ROOM_SUCCESS,
        payload
    }
}

export function createRoomError(error) {
    return {
        type: CREATE_ROOM_ERROR,
        error
    }
}

export function createRoom(roomName) {
    return async function (dispatch) {
        dispatch(createRoomRequest());
        await fetch(`http://localhost:3004/room?name=${roomName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) =>
            res.json()
        ).then((result) => {
            dispatch(createRoomSuccess(result));
        }).catch((error) => {
            dispatch(createRoomError(error));
        })
    }
}

export function joinRoomRequest(){
    return {
        type: JOIN_ROOM_REQUEST
    }
}

export function joinRoomSuccess(payload){
    return {
        type: JOIN_ROOM_SUCCESS,
        payload
    }
}

export function joinRoomError(error){
    return {
        type: JOIN_ROOM_ERROR,
        error
    }
}

export function joinRoom(roomId, username) {
    return async function (dispatch) {
        dispatch(joinRoomRequest());
        await fetch(`http://localhost:3004/api/room?name=${roomId}&username=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) =>
            res.json()
        ).then((result) => {
            dispatch(joinRoomSuccess(result));
        }).catch((error) => {
            dispatch(joinRoomError(error));
        })
    }
}

export function setUsername(username) {
    return {
        type: SET_USERNAME,
        username
    }
}

export function updateChatLog(update) {
    return {
        type: UPDATE_CHAT_LOG,
        update
    }
}