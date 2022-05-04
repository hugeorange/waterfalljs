export interface IwaterfallProps {
  /**
   * 瀑布流布局方式-->absolute定位 或者 grid 布局，默认 position
   */
  mode?: 'position' | 'grid'
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
  columnGap?: number
  /**
   * 每一行的间隙
   */
  rowGap?: number
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
  onChangeUlMaxH?: (h: number) => void,
}