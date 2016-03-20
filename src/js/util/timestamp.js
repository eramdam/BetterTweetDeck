import fecha from 'fecha'
import * as BHelper from './browserHelper'

let timestampMode
let fullAfter24

BHelper.settings.get('ts', (val) => {
  timestampMode = val
})

BHelper.settings.get('full_aft_24', (val) => {
  fullAfter24 = val
})

const formatMaps = {
  'absolute_us': {
    'full': 'MM/DD/YY hh:mm a',
    'short': 'hh:mm a'
  },
  'absolute_metric': {
    'full': 'DD/MM/YY HH:mm',
    'short': 'HH:mm'
  }
}

const moreThan24 = (d) => {
  return new Date().getTime() - d.getTime() <= 60 * 60 * 24000
}

const getFormat = (dateObject, timestampMode) => {
  if (fullAfter24 && moreThan24(dateObject)) {
    return formatMaps[timestampMode].short
  }

  return formatMaps[timestampMode].full
}

const getDateObject = (dateString) => {
  if (Number(dateString)) {
    return new Date(Number(dateString))
  }

  return new Date(dateString)
}

export default function timestampOnElement (element, dateString) {
  if (timestampMode === 'relative') {
    return
  }

  const d = getDateObject(dateString)

  element.innerHTML = fecha.format(d, getFormat(d, timestampMode))
}
