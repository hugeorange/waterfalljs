import React, { useState, useRef } from 'react'
import Waterfall from './react'
// import Waterfall from 'waterfalljs-layout/react'

const customStyle = `#waterfall li>div {
  border-radius: 8px;
  font-size: 20px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
  padding: 6px;
  background: rgb(255, 255, 255);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.5s
}
#waterfall li>div:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.3s
}
#waterfall li>div>img {
  width: 100%
}`

const defimages = [
  'https://picsum.photos/640/200/?random',
  'https://picsum.photos/360/640/?random',
  'https://picsum.photos/480/720/?random',
  'https://picsum.photos/480/640/?random',
  'https://picsum.photos/360/?random',
  'https://picsum.photos/360/520/?random',
  'https://picsum.photos/520/360/?random',
  'https://picsum.photos/520/360/?random',
  'https://picsum.photos/520/360/?random',
  'https://picsum.photos/720/640/?random',
]

export default function WaterfallDemo() {
  const [images, setImages] = useState<string[]>(defimages)
  const ulMaxHRef = useRef<number>(0)

  const handleSearchImage = async () => {
    function random(min: number, max: number) {
      return min + Math.floor(Math.random() * (max - min + 1))
    }
    const arr: any[] = []
    for (let i = 0; i < 9; i++) {
      const imgSrc = `${defimages[i]}=${random(1, 10000)}`
      arr.push(imgSrc)
    }
    setImages(prev => [...prev, ...arr])
  }
  return (
    <div
      style={{
        height: '600px',
        width: '600px',
        border: '1px solid',
        margin: '30px auto',
        overflowY: 'scroll'
      }}
      onScroll={e => console.log('scrollTop值-->',e.target.scrollTop, '----ul高度--->',ulMaxHRef.current)}
    >
      <Waterfall
        columnWidth={236}
        columnCount={2}
        gap={24}
        customStyle={customStyle}
        onChangeUlMaxH={h => (ulMaxHRef.current = h)}
      >
        {images.map((item: any, index) => {
          return (
            <li
              key={index}
              onClick={() => alert('图片地址为:' + item)}
            >
              <div>
                {index + 1}
                <img src={item} alt='' />
              </div>
            </li>
          )
        })}
      </Waterfall>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => handleSearchImage()} style={{ margin: '30px auto' }}>LOAD MORE</button>
      </div>
    </div>
  )
}

