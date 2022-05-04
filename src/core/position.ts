// 核心思路借鉴自 https://codepen.io/iounini/pen/KyYPKe
import { initWaterfallPositionStyle, loadImagesFunc } from './help'
import type { IwaterfallProps } from "./type";

type Ilistobj = { index: number; bottom: number; height: number }

export default class Waterfall {
  config: IwaterfallProps
  container: HTMLElement
  containerWidth: number
  columnCount: number
  liLeft: number
  liNodes: HTMLElement[]
  itemList: Ilistobj[]
  colList: Ilistobj[][]
  handleTimer: any
  ulMaxH: number
  prevImageLength: number
  prevLiNodesLength: number
  lastItemsBottom: number[]
  constructor(config: IwaterfallProps) {
    this.config = config
    // 容器
    this.container = document.querySelector(config.el) as HTMLElement
    // 容器宽度
    this.containerWidth = 0
    // 总共多少列
    this.columnCount = config.columnCount || 0
    // 第一列 left 值
    this.liLeft = 0
    // li元素集合
    this.liNodes = []
    // li 列表
    this.itemList = []
    // 列 列表
    this.colList = []
    // 轮询计时器
    this.handleTimer = null
    // 容器ul的最大高度
    this.ulMaxH = 0

    // 辅助优化措施
    // 上一次获取图片数量
    this.prevImageLength = 0
    // 上一次加载li元素数量
    this.prevLiNodesLength = 0
    // 上一轮最后一组数据的bottom
    this.lastItemsBottom = [0, 0]
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
    initWaterfallPositionStyle(el, columnWidth, customStyle)
  }
  /**
   * 初始化数据或加载更多时调用
   */
  public load() {
    const liNodes = this.container.querySelectorAll('li') as unknown as HTMLElement[]
    if (liNodes?.length <= 0) {
      throw `container element id:${this.config.el}>li is not exist`
    }
    const diffLen = this.prevLiNodesLength - liNodes.length
    this.liNodes = Array.from(liNodes).slice(diffLen)
    this.prevLiNodesLength = liNodes.length
    this.lastItemsBottom = this.colList.map(item => item[item.length - 1]?.bottom)
    this.initLayout()
    this.initPolling()
  }

  initLayout() {
    // 置空存储
    this.itemList = []
    this.colList = []

    // 初始化 列 数组
    for (let i = 0; i < this.columnCount; i++) {
      this.colList.push([])
    }

    for (let i = 0; i < this.liNodes.length; i++) {
      const h = this.liNodes[i].offsetHeight + this.config.rowGap
      this.itemList.push({
        index: i,
        bottom: h,
        height: h,
      })
    }
    this.refreshLayout()
  }

  refreshLayout() {
    const itemList = this.itemList
    const colList = this.colList

    // 智能排列
    for (let i = 0; i < this.liNodes.length; i++) {
      // 当前项的li的高度
      const liItemHeight = itemList[i].height
      // 当前bottom值
      let curBottom = 0
      // 列索引
      let colIndex = 0
      for (let j = 0; j < colList.length; j++) {
        // 当前列的长度
        const curColLastIndex = colList[j].length - 1
        // 每一列的最后一个元素的bottom值
        const lastItemBottom = colList[j]?.[curColLastIndex]?.bottom || this.lastItemsBottom[j] || 0
        // 最新的待塞进view的li元素
        const newItemBottom = lastItemBottom + liItemHeight
        // 遍历每一列找出bottom值最小的那一列，然后将新的元素塞进这一列
        if (curBottom == 0 || newItemBottom < curBottom) {
          curBottom = newItemBottom
          colIndex = j
        }
      }
      itemList[i].bottom = curBottom
      colList[colIndex].push(itemList[i])
    }
    this.renderView()
  }

  // 渲染视图
  renderView() {
    const colList = this.colList
    // 开始布局
    for (let i = 0; i < colList.length; i++) {
      const curCol = colList[i]
      for (let j = 0; j < curCol.length; j++) {
        const element = this.liNodes[curCol[j].index]
        const columnGap = i === 0 ? 0 : this.config.columnGap
        element.style.left = i * this.config.columnWidth + this.liLeft + columnGap + 'px'
        element.style.top = curCol[j].bottom - curCol[j].height + 'px'
      }
    }

    // 显示列表
    for (let i = 0; i < this.liNodes.length; i++) {
      if (!this.liNodes[i].classList.contains('show')) {
        this.liNodes[i].classList.add('show')
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
    this.container.style.height = this.ulMaxH + 'px'
  }
  // 图片加载器
  loadImages() {
    const imgs: any = this.container?.querySelectorAll('img') || []
    const diffLen = this.prevImageLength - imgs.length
    const needLoadedImages = [...imgs].slice(diffLen)
    this.prevImageLength = imgs.length
    return loadImagesFunc(needLoadedImages)
  }
  // 初始化轮询刷新视图，图片加载完成停止轮询
  initPolling() {
    this.pollingRefresh()

    this.loadImages()
      .then(() => {
        this.handleTimer && clearInterval(this.handleTimer)
        this.initLayout()
        setTimeout(() => {
          this.config?.onChangeUlMaxH?.(this.ulMaxH)
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