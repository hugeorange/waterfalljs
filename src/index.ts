import WaterfallPosition from './core/position'
import WaterfallGrid from './core/grid'
import { defaultConfig } from "./core/help";
import type { IwaterfallProps } from "./core/type";
/**
 * 瀑布流布局核心代码
 * position方案核心思路借鉴自 https://codepen.io/iounini/pen/KyYPKe
 * grid方案核心思路借鉴自 https://juejin.cn/post/6844904004720263176#heading-5
 */



export default function Waterfall(config: IwaterfallProps) {
  const cfg = Object.assign(defaultConfig, config)
  if (cfg.mode === 'position') {
    return new WaterfallPosition(cfg)
  } else {
    return new WaterfallGrid(cfg)
  }
}