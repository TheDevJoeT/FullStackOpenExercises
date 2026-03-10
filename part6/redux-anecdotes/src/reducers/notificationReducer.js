import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'this is the initial notification',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  }
})

export const setNotificationForTime = (message, time) => {
  return dispatch => {
    dispatch(setNotification(message))

    setTimeout(() => {
      dispatch(removeNotification())
    }, time * 1000)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer