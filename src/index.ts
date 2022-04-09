/**
 * 瀑布流布局核心代码
 * 核心思路借鉴自 https://codepen.io/iounini/pen/KyYPKe
 */

 interface IwaterfallProps {
  /**
   * 绑定ul元素的id，ul元素需使用者自己创建
   */
  el: string
  /**
   * 每一列的宽度
   */
  columnWidth: number
    /**
   * 多少列，若不传则由程序根据 columnWidth 和容器宽度自动获取
   */
  columnCount?: number
    /**
   * 每一列之间的间隙，最左侧一栏紧挨容器左侧
   */
  gap: number
  /**
   * 轮询布局延迟时间
   */
  delay: number
  /**
   * 插入自定义样式
   */
  customStyle: string
  /**
   * 实时获取容器高度，可在上拉加载场景中使用
   */
  onChangeUlMaxH?: (h: number) => void
}

const defaultConfig: IwaterfallProps = {
  el: '#waterfall',
  columnWidth: 360, // 项目宽度
  columnCount: undefined, // 列数，若不传则自动计算
  gap: 24, // 项目间隙
  delay: 500, // 轮询刷新延迟时间
  customStyle: '', // 自定义样式的模板字符串样式
  onChangeUlMaxH: h => h,
}

type Ilistobj = { index: number; bottom: number; height: number }

export default class Waterfall {
  private config: IwaterfallProps
  private ul: HTMLElement
  private ulWidth: number
  private ulColumn: number
  private liLeft: number
  private list: Ilistobj[]
  private colList: Ilistobj[][]
  private handleTimer: any
  private ulMaxH: number
  private prevImageLength: number
  constructor(config: IwaterfallProps) {
    this.config = Object.assign(defaultConfig, config)
    // 容器
    this.ul = document.querySelector(config.el) as HTMLElement
    // 容器宽度
    this.ulWidth = 0
    // 总共多少列
    this.ulColumn = config.columnCount || 0
    // 第一列 left 值
    this.liLeft = 0
    // li 列表
    this.list = []
    // 列 列表
    this.colList = []
    // 轮询计时器
    this.handleTimer = null
    // 容器ul的最大高度
    this.ulMaxH = 0

    // 辅助优化措施
    // 上一次获取图片数量
    this.prevImageLength = 0
  }
  /**
   * 初始化程序-首次加载
   */
  public init() {
    if (!this.ul) {
      throw 'container ul element is not exist'
    }
    const { el, columnWidth, customStyle } = this.config
    this.ul.style.position = 'relative'
    this.ulWidth = this.ul.offsetWidth
    this.ulColumn = this.ulColumn || parseInt(this.ulWidth / columnWidth + '')

    // 插入样式
    initWaterfallStyle(el, columnWidth, customStyle)
    // 执行轮询刷新视图
    this.initPolling()
  }
  /**
   * 加载更多时调用，不必再调用 init
   */
  public loadMore() {
    this.initPolling()
  }

  private initLayout() {
    const liItems = this.ul.querySelectorAll('li') as unknown as HTMLElement[]
    if (liItems?.length <= 0) {
      console.error('list li element is not exist')
      return
    }
    // 置空存储
    this.list = []
    this.colList = []

    // 初始化 列 数组
    for (let i = 0; i < this.ulColumn; i++) {
      this.colList.push([])
    }

    // 初始化li列表
    for (let i = 0; i < liItems.length; i++) {
      const h = liItems[i].offsetHeight // 耗时操作待优化
      this.list.push({
        index: i,
        bottom: h,
        height: h,
      })
    }
    this.refreshLayout(liItems)
  }

  private refreshLayout(liItems: HTMLElement[]) {
    const list = this.list
    const colList = this.colList

    // 智能排列
    for (let i = 0; i < liItems.length; i++) {
      if (i < this.ulColumn) {
        // 第一行排列
        colList[i].push(list[i])
      } else {
        // 当前项的li的高度
        const liItemHeight = list[i].height
        // 当前bottom值
        let curBottom = 0
        // 列索引
        let colIndex = 0
        for (let j = 0; j < colList.length; j++) {
          // 当前列的长度
          const curColLastIndex = colList[j].length - 1
          // 每一列的最后一个元素的bottom值
          const lastItemBottom = colList[j][curColLastIndex].bottom
          // 最新的待塞进view的li元素
          const newItemBottom = lastItemBottom + liItemHeight
          // 遍历每一列找出bottom值最小的那一列，然后将新的元素塞进这一列
          if (curBottom == 0 || newItemBottom < curBottom) {
            curBottom = newItemBottom
            colIndex = j
          }
        }
        list[i].bottom = curBottom
        colList[colIndex].push(list[i])
      }
    }
    this.renderView(liItems)
  }
  // 渲染视图
  private renderView(liItems: HTMLElement[]) {
    const colList = this.colList
    // 开始布局
    for (let i = 0; i < colList.length; i++) {
      const curCol = colList[i]
      for (let j = 0; j < curCol.length; j++) {
        const liItem = liItems[curCol[j].index]
        const gap = i === 0 ? 0 : this.config.gap
        liItem.style.left = i * this.config.columnWidth + this.liLeft + gap + 'px'
        liItem.style.top = curCol[j].bottom - curCol[j].height + 'px'
      }
    }
    // 显示列表
    for (let i = 0; i < liItems.length; i++) {
      if (!liItems[i].classList.contains('show')) {
        liItems[i].classList.add('show')
      }
    }
    // 设置ul容器高度
    for (let i = 0; i < colList.length; i++) {
      const lastIndex = colList[i].length - 1
      const h = colList[i][lastIndex].bottom
      if (this.ulMaxH < h) {
        this.ulMaxH = h
      }
    }
    this.ul.style.height = this.ulMaxH + 'px'
  }
  // 图片加载器
  private loadImages() {
    const imgs: any = this.ul?.querySelectorAll('img') || []
    const diffLen = this.prevImageLength - imgs.length
    const urlArrsPromise = [...imgs].slice(diffLen).map(image => {
      return new Promise((resolve, reject) => {
        image.onload = function () {
          resolve('image unloded')
        }
        image.onerror = function () {
          reject('image unloded error')
        }
        if (image.complete) {
          resolve('image unloded')
        }
      })
    })
    this.prevImageLength = imgs.length
    return Promise.allSettled(urlArrsPromise)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  // 初始化轮询刷新视图，图片加载完成停止轮询
  private initPolling() {
    this.initLayout()
    this.pollingRefresh()

    this.loadImages()
      .then(() => {
        console.log('图片全部成功加载')
        this.handleTimer && clearInterval(this.handleTimer)
        this.initLayout()
        setTimeout(() => {
          this.config?.onChangeUlMaxH?.(this.ulMaxH)
        }, 20)
      })
      .catch(err => {
        console.log('图片加载出错', err)
        this.handleTimer && clearInterval(this.handleTimer)
      })
  }
  private pollingRefresh() {
    this.handleTimer && clearInterval(this.handleTimer)
    this.handleTimer = setInterval(() => {
      this.initLayout()
      console.log('polling refresh...')
    }, this.config.delay)
  }
}

// 塞入自定义样式
function initWaterfallStyle(
  container: string,
  columnWidth: number,
  customStyle: string,
) {
  const style = document.createElement('style')
  const containerStyle = `
      ${container} li {
          position: absolute;
          width: ${columnWidth}px;
          left: 0;
          top: 0;
          opacity: 0;
          z-index: 1;
          transform: translateY(100px)
      }
      ${container} li.show {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.3s, top 0.6s
      }
      ${customStyle}
  `
  style.innerHTML = containerStyle
  document.head.appendChild(style)
}
