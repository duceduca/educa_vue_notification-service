import { addMinutes, format } from 'date-fns'

export const store = (data) => {
  console.debug(
    `(store)check time: ${process.env.VUE_APP_MINUTES_TO_CHECK_FOR_TOKEN_REFRESH}`
  )
  window.localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken))
  window.localStorage.setItem('token', JSON.stringify(data.accessToken))
  window.localStorage.setItem(
    'tokenExpiration',
    JSON.stringify(
      format(
        addMinutes(
          new Date(),
          process.env.VUE_APP_MINUTES_TO_CHECK_FOR_TOKEN_REFRESH
        ),
        't'
      )
    )
  )
  window.localStorage.setItem('user', JSON.stringify(data.user))
}

export const remove = () => {
  window.localStorage.removeItem('refreshToken')
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('tokenExpiration')
  window.localStorage.removeItem('user')
}

export const updateToken = (data) => {
  window.localStorage.setItem('token', JSON.stringify(data.token))
  window.localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken))
  window.localStorage.setItem(
    'tokenExpiration',
    JSON.stringify(
      format(
        addMinutes(
          new Date(),
          process.env.VUE_APP_MINUTES_TO_CHECK_FOR_TOKEN_REFRESH
        ),
        't'
      )
    )
  )
}
