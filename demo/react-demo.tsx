import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react'
import Waterfall from '../src/react'
// import Waterfall from 'waterfalljs-layout/react'

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


const customStyle = `#react-waterfall-comps li>div {
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
#react-waterfall-comps li>div:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.3s
}
#react-waterfall-comps li>div>img {
  width: 100%
}`

const customStyleGrid = `#react-waterfall-grid-comps li>div {
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
#react-waterfall-grid-comps li>div:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.3s
}
#react-waterfall-grid-comps li>div>img {
  width: 100%
}`


function WaterfallPositionDemo() {
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
          width: '520px',
          border: '1px solid',
          marginTop: '30px',
          overflowY: 'scroll'
        }}
      >
        <Waterfall
          columnWidth={236}
          columnCount={2}
          columnGap={24}
          rowGap={24}
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

function WaterfallGridDemo() {
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
          width: '520px',
          border: '1px solid',
          marginTop: '30px',
          overflowY: 'scroll'
        }}
      >
        <Waterfall
          mode='grid'
          el="#react-waterfall-grid-comps"
          columnWidth={236}
          columnCount={2}
          columnGap={24}
          rowGap={24}
          customStyle={customStyleGrid}
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



ReactDOM.render(
  <div>
    <div style={{ margin: '20px' }}>
      <a href="https://codepen.io/iounini/pen/KyYPKe" target="_blank">position版本核心思路</a><br />
      <a href="https://juejin.cn/post/6844904004720263176#heading-6" target="_blank">grid布局版本核心思路</a><br />
      <a href='https://codesandbox.io/s/busy-faraday-w538tc' target="_blank">codesandbox演示页面 </a>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h3>position版本</h3>
        <WaterfallPositionDemo />
      </div>
      <div>
        <h3>grid版本</h3>
        <WaterfallGridDemo />
      </div>
    </div>
  </div>
  ,
  document.getElementById('App')
)
