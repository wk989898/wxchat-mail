/**
 * 
 * @param {number} time 
 * @param {Function} cb 
 */
export function throttle() {
  let timer, status = true
  return function (time, cb) {
    if (status) {
      status = false
      timer = setTimeout(() => {
        status = true
      }, time)
      cb()
    }
  }
}
export function format(date) {
  var now = new Date(date)
  var a = '/'
  return now.getFullYear().toString() + a +
    now.getMonth().toString().padStart(2, '0') + a +
    now.getDay().toString().padStart(2, '0')
}