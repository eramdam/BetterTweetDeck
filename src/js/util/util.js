const $ = (sel, parent = document) => {
  let arr

  arr = [].slice.call(parent.querySelectorAll(sel))

  return arr.length >= 1 ? arr : null
}

const TIMESTAMP_INTERVAL = 1e3 * 8

module.exports = { $, TIMESTAMP_INTERVAL }
