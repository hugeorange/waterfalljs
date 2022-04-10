import React, { ReactElement, useEffect, useRef } from 'react'

import Waterfall from './index'

interface Iprops {
  children?: ReactElement[]
  columnWidth: number
  columnCount: number
  gap: number
  customStyle?: string
  onChangeUlMaxH?: (h: number) => void
}
export default function WaterfallComps({
  children,
  columnWidth,
  columnCount,
  gap,
  customStyle='',
  onChangeUlMaxH,
}: Iprops): ReactElement {
  const wfRef = useRef<any>()

  useEffect(() => {
    if (wfRef.current) return
    wfRef.current = new Waterfall({
      el: '#waterfall',
      columnWidth: columnWidth,
      columnCount: columnCount,
      gap: gap,
      delay: 500,
      customStyle,
      onChangeUlMaxH: h => {
        onChangeUlMaxH?.(h)
      },
    })
  }, [])

  useEffect(() => {
    if (children.length) {
      wfRef.current?.loadMore?.()
    }
  }, [children.length])
  
  return <ul id='waterfall'>{children}</ul>
}
