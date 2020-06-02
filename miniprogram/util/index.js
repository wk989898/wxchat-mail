/**
 * 
 * @param {number} time 
 * @param {Function} cb 
 */
export function throttle() {
  let timer, _throttle = true
  return function (time, cb) {
    if (_throttle) {
      _throttle = false
      timer = setTimeout(() => {
        _throttle = true
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