process.env.NODE_ENV = 'development'

import babel from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve';
import typescript from "rollup-plugin-typescript2";

import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import html from '@rollup/plugin-html'
import serve from 'rollup-plugin-serve'
const path = require('path')

export default {
    input: 'src/react-demo.tsx',
    output: {
        format: 'umd',
        file: path.resolve(__dirname, 'dist-react/index.js'), // 出口文件
		sourcemap: true // 根据源码产生映射文件
    },
    sourcemap: true,
    plugins: [
        // 不知道怎么加载 node_modules 里面的模块总是加载不到 @rollup/plugin-node-resolve 也用了，不知道为什么也不能用，打包有问题 or rollup配置有问题
        resolve({// 第三方文件解析
			extensions: ['.js', '.ts', '.jsx', '.tsx']
		}),
        commonjs(),
        // 此处好像不能识别 .babelrc 文件，必须在这地方设置
        babel({
            presets: ['@babel/preset-react'],
            exclude: 'node_modules/**', // 只编译我们的源代码
            babelHelpers: 'bundled',
        }),
        typescript({
            exclude: "node_modules/**",
            declarationDir: process.cwd()
        }),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        html({
            fileName: 'index.html',
            template: () => {
                return `
                    <!DOCTYPE html>
                    <html lang="zh-cn">
                        <head>
                            <title>rollup-React</title>
                            <style>* { margin: 0; padding: 0; list-style: none } </style>
                        </head>
                        <body>
                            <div id='App'></div>
                            <script src='index.js'></script>
                        </body>
                    </html>
                `
            }
        }),
        serve({
            port: 8090,
            // open: true,
            contentBase: ['dist-react']
        })
    ]
}

/**
 * 配置参考文章：
 * 1. https://juejin.cn/post/6991394840537726990
 * 2. https://www.chenxiaolani.com/2020/%E4%BD%BF%E7%94%A8rollup%E6%89%93%E5%8C%85vue%E6%88%96react%E7%BB%84%E4%BB%B6%E5%BA%93%E5%B9%B6%E5%8F%91%E5%B8%83%E5%88%B0npm/
 * 3. https://www.zhouzh.tech/posts/dbb6f710-9f60-11eb-9938-e36f3791eca3
 */