import { isPast, format, parseISO } from 'date-fns'
import { es, fr, zhCN, uk } from 'date-fns/locale'
import i18n from '@/plugins/i18n'
import * as types from '@/store/mutation-types'
import { store } from '@/store'

const localesDateFns = {
  es,
  fr,
  cn: zhCN,
  ua: uk
}

export const extract = (input, startSymbol, endSymbol) => {
  const output = []
  let currentPosition = 0
  while (currentPosition < input.length) {
    // console.log(`(extract)currentPosition 1: ${currentPosition}`)

    currentPosition = input.indexOf(startSymbol, currentPosition)
    // console.log(`(extract)currentPosition 2: ${currentPosition}`)
    if (currentPosition < 0) {
      break
    }

    const endPosition = input.indexOf(endSymbol, currentPosition)
    if (endPosition < 0) {
      break
    }
    output.push(
      input.substring(currentPosition + startSymbol.length, endPosition)
    )

    currentPosition = endPosition
  }

  return output
}

export const getFormat = (date, formatStr) => {
  return format(parseISO(date), formatStr, {
    locale: localesDateFns[window.__localeId__]
  })
}

export const getFormatTimestamp = (time) => {
  return format(time, 'iii, MMMM d yyyy, h:mm a', {
    locale: localesDateFns[window.__localeId__]
  })
}

export const getFormatLimitTime = (seconds) => {
  if (seconds === 0) {
    return `${i18n.t('common.NO_LIMIT')}`
  }
  return `${seconds / 60} ${i18n.t('common.MINUTE')}`
}

// eslint-disable-next-line complexity
export const getIndexText = (index) => {
  // console.info(`(getIndexText)index: ${index}`)
  switch (index) {
    case 0:
      return 'A'
    case 1:
      return 'B'
    case 2:
      return 'C'
    case 3:
      return 'D'
    case 4:
      return 'E'
    case 5:
      return 'F'
    case 6:
      return 'G'
    case 7:
      return 'H'
    case 8:
      return 'I'
    case 9:
      return 'J'
    case 10:
      return 'K'
    default:
      return 'X'
    // code block
  }
}

export const getUrl = (fileArea, questionId, filename) => {
  const mediaUrl = process.env.VUE_APP_MEDIA_URL || ''
  return `${mediaUrl}/quizfile.php/${fileArea}/${questionId}${filename}`
}

export const formatHtml = (fileArea, itemId, input) => {
  // console.info(`(formatHtml)itemId: ${itemId}`)
  const filenames = extract(input, '@@PLUGINFILE@@', '"')
  // console.info(`(formatHtml)filenames: ${JSON.stringify(filenames)}`)
  if (filenames.length === 0) {
    return input
  }

  let output = input
  for (const filename of filenames) {
    output = output.replace(
      `@@PLUGINFILE@@${filename}`,
      getUrl(fileArea, itemId, filename)
    )
  }
  return output
}

export const formatErrorMessages = (translationParent, msg) => {
  const errorArray = []
  // Check for error msgs
  if (msg !== null) {
    const json = JSON.parse(JSON.stringify(msg))
    // If error message is an array, then we have mutiple errors
    if (Array.isArray(json)) {
      json.map((error) => {
        errorArray.push(i18n.t(`${translationParent}.${error.msg}`))
      })
    } else {
      // Single error
      errorArray.push(i18n.t(`${translationParent}.${msg}`))
    }
    return errorArray
  }
  // all good, return null
  return null
}

export const buildPayloadPagination = (pagination, search) => {
  const { page, itemsPerPage } = pagination
  let { sortDesc, sortBy } = pagination

  // When sorting you always get both values
  if (sortBy.length === 1 && sortDesc.length === 1) {
    // Gets order
    sortDesc = sortDesc[0] === true ? -1 : 1
    // Gets column to sort on
    sortBy = sortBy ? sortBy[0] : ''
  }

  let query = {}

  // If search and fields are defined
  if (search) {
    query = {
      sort: sortBy,
      order: sortDesc,
      page,
      limit: itemsPerPage,
      filter: search.query,
      fields: search.fields
    }
  } else {
    // Pagination with no filters
    query = {
      sort: sortBy,
      order: sortDesc,
      page,
      limit: itemsPerPage
    }
  }
  return query
}

// Catches error connection or any other error (checks if error.response exists)
export const handleError = (error, commit, reject) => {
  let errMsg = ''
  // Resets errors in store
  commit(types.SHOW_LOADING, false)
  commit(types.ERROR, null)

  // Checks if unauthorized
  if (error.response.status === 401) {
    store.dispatch('userLogout')
  } else {
    // Any other error
    errMsg = error.response
      ? error.response.data.message
      : 'SERVER_TIMEOUT_CONNECTION_ERROR'
    setTimeout(() => {
      return errMsg
        ? commit(types.ERROR, errMsg)
        : commit(types.SHOW_ERROR, false)
    }, 0)
  }
  reject(error)
}

export const buildSuccess = (
  msg,
  commit,
  resolve,
  resolveParam = undefined
) => {
  commit(types.SHOW_LOADING, false)
  commit(types.SUCCESS, null)
  setTimeout(() => {
    return msg ? commit(types.SUCCESS, msg) : commit(types.SHOW_SUCCESS, false)
  }, 0)
  commit(types.ERROR, null)
  resolve(resolveParam)
}

// Checks if tokenExpiration in localstorage date is past, if so then trigger an update
export const checkIfTokenNeedsRefresh = () => {
  // Checks if time set in localstorage is past to check for refresh token
  if (
    window.localStorage.getItem('token') !== null &&
    window.localStorage.getItem('tokenExpiration') !== null
  ) {
    if (
      isPast(
        new Date(
          parseISO(JSON.parse(window.localStorage.getItem('tokenExpiration'))) *
            1000
        )
      )
    ) {
      store.dispatch('refreshToken')
    }
  }
}
