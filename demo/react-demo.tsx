import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react'
import Waterfall from '../src/react'
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

console.log('Waterfall--->', Waterfall)

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

function WaterfallDemo() {
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
    <div>
      <div style={{ margin: '20px' }}>
        <a href="https://codepen.io/iounini/pen/KyYPKe" target="_blank">核心思路来自这里</a><br />
        <a
          href="https://shuliqi.github.io/2020/11/17/%E7%80%91%E5%B8%83%E6%B5%81%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F" target="_blank">基本实现原理</a>
        <a href='https://codesandbox.io/s/busy-faraday-w538tc' target="_blank">codesandbox演示页面 </a>
      </div>
      <div
        style={{
          height: '600px',
          width: '520px',
          border: '1px solid',
          margin: '30px auto',
          overflowY: 'scroll'
        }}
        // onScroll={e => console.log('scrollTop值-->', e.target.scrollTop, '----ul高度--->', ulMaxHRef.current)}
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
    </div>
  )
}




ReactDOM.render(
    <WaterfallDemo/>,
    document.getElementById('App')
)
