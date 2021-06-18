export function drawPatrolPath(coordinate, formItem) {
  drawPath(coordinate, formItem)
}

// 绘制路线
function drawPath(coordinate, formItem) {
  const context = formItem.canvasContext
  context.clearRect(0, 0, formItem.width, formItem.height) // 清空画布内容

  if (coordinate.length > 1) {
    drawLine(context, coordinate) // 绘制圆点之间的连线
  }
  drawCircle(context, coordinate, formItem.colors) // 绘制实心圆点
  drawCircleText(context, coordinate) // 绘制圆点上的序号
  if (coordinate.length > 1) {
    drawDirection(context, coordinate) // 绘制线头
  }
}

// 绘制实心圆点
function drawCircle(context, coordinate, colors) {
  for (let i = 0; i < coordinate.length; i++) {
    let coordinateX = coordinate[i][0]
    let coordinateY = coordinate[i][1]
    context.fillStyle = colors[i]
    context.beginPath()
    context.arc(coordinateX, coordinateY, 8, Math.PI * 2, 0, true)
    context.closePath()
    context.fill()

    context.lineWidth = 0.8
    context.strokeStyle = 'rgba(255,255,255,0.5)'
    context.arc(coordinateX, coordinateY, 8, Math.PI * 2, 0, false)
    context.stroke()
    context.closePath()
    context.fill()
  }
}

// 绘制圆点上的序号
function drawCircleText(context, coordinate) {
  for (let i = 0; i < coordinate.length; i++) {
    context.fillStyle = 'white'
    context.textAlign = 'center'
    context.fillText(i + 1 + '', coordinate[i][0], coordinate[i][1] + 4)
  }
}

// 绘制圆点之间的连线
function drawLine(context, coordinate) {
  context.strokeStyle = 'red'
  for (let i = 0; i < coordinate.length; i++) {
    if (i === coordinate.length - 1) {
      // 结束绘制
      break
    }
    context.beginPath()
    context.moveTo(coordinate[i][0], coordinate[i][1])
    context.lineTo(coordinate[i + 1][0], coordinate[i + 1][1])
    context.stroke()
    context.closePath()
  }
}

// 绘制线头
function drawDirection(context, coordinate) {
  for (let i = 0; i < coordinate.length; i++) {
    if (i === coordinate.length - 1) {
      // 结束绘制
      break
    }
    let x = (coordinate[i][0] + coordinate[i + 1][0]) / 2
    let y = (coordinate[i][1] + coordinate[i + 1][1]) / 2

    // 计算偏离Y轴的角度
    let ang = (coordinate[i + 1][0] - coordinate[i][0]) / (coordinate[i + 1][1] - coordinate[i][1])
    ang = Math.atan(ang)

    context.save()
    context.beginPath()
    context.translate(x, y) // 平移至线段中点位置
    if (coordinate[i + 1][1] - coordinate[i][1] >= 0) {
      context.rotate(-ang)
    } else {
      context.rotate(Math.PI - ang) // 翻转角度
    }
    context.lineTo(-5, -10)
    context.lineTo(0, -7)
    context.lineTo(5, -10)
    context.lineTo(0, 0)
    context.fillStyle = 'red'
    context.fill()
    context.restore()
    context.closePath()
  }
}
