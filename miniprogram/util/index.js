/**
 * 
 * @param {number} time 
 * @param {Function} cb 
 */
let timer, _throttle = true
export function throttle(time, cb) {
  if (_throttle) {
    timer = setTimeout(() => {
      cb()
      _throttle = true
    }, time);
    _throttle = false
  }
}
export function format(date) {
  var now = new Date(date)
  var a = '/'
  return now.getFullYear().toString() + a +
    now.getMonth().toString().padStart(2, '0') + a +
    now.getDay().toString().padStart(2, '0')
}