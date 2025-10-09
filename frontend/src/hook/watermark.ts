const setWatermark = (str1:string) => {
  const id = 'yunji-watermark'
  if (document.getElementById(id) !== null) {
    document.getElementById(id)?.remove()
  }

  const can = document.createElement('canvas')
  // 设置canvas画布大小
  can.width = 300
  can.height = 150

  const cans = can.getContext('2d')
  if (!cans) return
  cans.rotate(-20 * Math.PI / 180) // 水印旋转角度
  cans.font = '15px Vedana'
  cans.fillStyle = '#666666'
  cans.textAlign = 'left'
  cans.textBaseline = 'middle'
  cans.fillText(str1, 0, can.height) // 水印在画布的位置x，y轴
  // cans.fillText(str2, can.width / 2, can.height + 22)

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '56px'
  div.style.left = '0px'
  div.style.opacity = '0.1'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight - 56 + 'px' // 56 navBar高度
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 添加水印方法
export const setWaterMark = (str1:string) => {
  let id = setWatermark(str1)
  if (!id) return
  if (document.getElementById(id) === null) {
    id = setWatermark(str1)
  }
}

// 移除水印方法
export const removeWatermark = () => {
  const id = 'yunji-watermark'
  if (document.getElementById(id) !== null) {
    document.getElementById(id)?.remove()
  }
}
