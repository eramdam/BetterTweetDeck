export function $ (sel, parent = document) {
  let arr

  arr = [].slice.call(parent.querySelectorAll(sel))

  return arr.length >= 1 ? arr : null
}

export const TIMESTAMP_INTERVAL = 1e3 * 8
