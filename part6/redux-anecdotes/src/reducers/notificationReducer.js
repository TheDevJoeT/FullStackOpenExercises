import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'this is the initial notification',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  }
})

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(showNotification(message))

    setTimeout(() => {
      dispatch(removeNotification())
    }, seconds * 1000)
  }
}

export const { showNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer