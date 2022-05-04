// 默认配置项
export const defaultConfig = {
  mode: 'position',
  el: '#waterfall',
  columnWidth: 360, // 项目宽度
  columnCount: undefined, // 列数，若不传则自动计算
  columnGap: 24, // 列间隙
  rowGap: 24, // 行间隙
  delay: 500, // 轮询刷新延迟时间
  customStyle: '', // 自定义样式的模板字符串样式
  onChangeUlMaxH: (h: number) => h,
}


// 塞入position方案自定义样式
export function initWaterfallPositionStyle(
  container: string,
  columnWidth: number,
  customStyle: string,
) {
  const style = document.createElement('style')

  const containerStyle = `
      ${container} {
        position: relative;
      }
      ${container}>li {
          position: absolute;
          width: ${columnWidth}px;
          left: 0;
          transform: translateY(200px);
      }
      ${container}>li.show {
        transform: translateY(0);
        transition: all 0.3s;
      }
      ${customStyle}
  `
  style.innerHTML = containerStyle
  document.head.appendChild(style)
}


// 塞入自定义样式-grid 布局
export function initWaterfallGridStyle(
  container: string,
  columnCount: number,
  columnWidth: number,
  customStyle: string,
) {
  const style = document.createElement('style')
  // column-columnGap: 5px;

  const containerStyle = `
      ${container} {
          display: grid;
          grid-template-columns: repeat(${columnCount}, 1fr);
          grid-auto-rows: 1px;
      }
      ${container}>li {
          width: ${columnWidth}px;
          transform: translateY(200px);
      }
      ${container}>li.show {
        transform: translateY(0);
        transition: all 0.3s;
      }
      ${customStyle}
  `
  style.innerHTML = containerStyle
  document.head.appendChild(style)
}



// 图片加载器
export function loadImagesFunc(imgs: any[]): Promise<any> {
  const urlArrsPromise = [...imgs].map(image => {
    return new Promise((resolve, reject) => {
      image.onload = function () {
        resolve('image unloded')
      }
      image.onerror = function () {
        reject('image unloded error')
      }
      if (image.complete) {
        resolve('image has loded')
      }
    })
  })
  return Promise.allSettled(urlArrsPromise)
    .then(res => res)
    .catch(err => console.log(err))
}
