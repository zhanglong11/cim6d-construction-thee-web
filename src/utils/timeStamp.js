import _ from 'lodash'

export default function timeStamp(second_time) {
  if (_.isNil(second_time) || _.isNaN(second_time)) {
    return null
  }
  let time = parseInt(second_time) + '秒'
  if (parseInt(second_time) > 60) {
    let second = parseInt(second_time) % 60
    let min = parseInt(second_time / 60)
    time = min + '分' + second + '秒'

    if (min > 60) {
      min = parseInt(second_time / 60) % 60
      let hour = parseInt(parseInt(second_time / 60) / 60)
      time = hour + '小时' + min + '分' + second + '秒'

      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24
        let day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24)
        time = day + '天' + hour + '小时' + min + '分' + second + '秒'
      }
    }
  }

  time = time.replace('天0小时0分0秒', '天')
  time = time.replace('时0分0秒', '时')
  time = time.replace('分0秒', '分')
  return time
}
