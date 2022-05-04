// 核心思路借鉴自：https://juejin.cn/post/6844904004720263176#heading-6
import { initWaterfallGridStyle, loadImagesFunc } from './help'
import type { IwaterfallProps } from "./type";


export default class Waterfall {
  config: IwaterfallProps
  container: HTMLElement
  containerWidth: number
  columnCount: number
  handleTimer: any
  prevImageLength: number
  prevLiNodesLength: number
  divItemNodes: Element[]
  liNodes: Element[]
  constructor(config: IwaterfallProps) {
    this.config = config
    // 容器
    this.container = document.querySelector(config.el) as HTMLElement
    // 容器宽度
    this.containerWidth = 0
    // 总共多少列
    this.columnCount = config.columnCount || 0
    // 轮询计时器
    this.handleTimer = null

    // 辅助优化措施
    this.divItemNodes = []
    this.liNodes = []
    // 上一次获取图片数量
    this.prevImageLength = 0
    // 上一次加载li元素数量
    this.prevLiNodesLength = 0
    // 初始化配置
    this.init()
  }
  init() {
    if (!this.container) {
      throw `container element id:${this.config.el} is not exist`
    }
    const { el, columnWidth, customStyle } = this.config
    this.containerWidth = this.container.offsetWidth
    this.columnCount = this.columnCount || parseInt(this.containerWidth / columnWidth + '')

    // 插入样式
    initWaterfallGridStyle(el, this.columnCount, columnWidth, customStyle)
  }
  /**
   * 初始化数据或加载更多时调用
   */
  public load() {
    const liNodes = this.container.querySelectorAll('li')
    const divItemNodes = this.container.querySelectorAll('li>div')
    if (divItemNodes?.length <= 0) {
      throw `container element id:${this.config.el}>li is not exist`
      return
    }
    const diffLen = this.prevLiNodesLength - liNodes.length
    this.divItemNodes = Array.from(divItemNodes).slice(diffLen)
    this.liNodes = Array.from(liNodes).slice(diffLen)
    this.prevLiNodesLength = liNodes.length

    this.initLayout()
    this.initPolling()
  }

  initLayout() {
    const divItemNodes = this.divItemNodes
    const liNodes = this.liNodes
    // 置空存储
    let list = []
    // 初始化li列表
    for (let i = 0; i < divItemNodes.length; i++) {
      const h = (divItemNodes[i] as HTMLElement).offsetHeight
      list.push(h)
    }

    for (let i = 0; i < liNodes.length; i++) {
      const item: any = liNodes[i]
      const spanH = list[i]
      item.style.gridRowEnd = `span ${parseInt(spanH) + this.config.rowGap}`
      if (!liNodes[i].classList.contains('show')) {
        liNodes[i].classList.add('show')
      }
    }
  }

  // 图片加载器
  loadImages() {
    const imgs: NodeList = this.container?.querySelectorAll('img')
    const diffLen = this.prevImageLength - imgs.length
    const needLoadedImages = Array.from(imgs).slice(diffLen)
    this.prevImageLength = imgs.length
    return loadImagesFunc(needLoadedImages)
  }
  // 初始化轮询刷新视图，图片加载完成停止轮询
  initPolling() {
    this.pollingRefresh()

    this.loadImages()
      .then((res) => {
        this.handleTimer && clearInterval(this.handleTimer)
        this.initLayout()
        setTimeout(() => {
          if (this.config.onChangeUlMaxH) {
            const ulMaxH = this.container.offsetHeight
            this.config.onChangeUlMaxH(ulMaxH)
          }
        }, 20)
      })
      .catch(err => {
        console.log("图片加载任务出错-->", err);
        this.handleTimer && clearInterval(this.handleTimer)
      })
  }
  pollingRefresh() {
    this.handleTimer && clearInterval(this.handleTimer)
    this.handleTimer = setInterval(() => {
      this.initLayout()
      console.log('polling refresh...')
    }, this.config.delay)
  }
}

