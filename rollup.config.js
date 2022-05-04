import resolve from 'rollup-plugin-node-resolve';
import serve from "rollup-plugin-serve";
import livereload from 'rollup-plugin-livereload'; 
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import htmlTemplate from 'rollup-plugin-generate-html-template';
import typescript from "rollup-plugin-typescript2";


import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';

const sourcemap = isDev ? false : false;

let plugins = [];
if (isDev) {
    // 直接在index.html 用相对路劲引入dist内打包后的文件
    plugins = [
        serve({ contentBase: ['dist', 'src'] }),
    ]
} else {
    plugins = [ terser() ]
}

const commonPlugins = [
    resolve(), // 引用commonjs模块时需要
    babel({
        exclude: 'node_modules/**', // 防止打包node_modules下的文件
        runtimeHelpers: true,       // 使plugin-transform-runtime生效
    }),
    commonjs(), // 引用commonjs模块时需要
    typescript({
        exclude: "node_modules/**",
        declarationDir: process.cwd()
    }),
    ...plugins
]

export default [
    {
        input: 'src/index.ts',
        output: [
            { name: "Waterfall", file: pkg.unpkg, format: 'umd', sourcemap },
            { name: "Waterfall", file: pkg.module, format: 'es', sourcemap },
        ],
        plugins: commonPlugins,
    },
    {
        input: 'src/react.tsx',
        output: [
            { name: "Waterfall", file: "dist/react/index.esm.js", format: 'es', sourcemap: true }
        ],
        plugins: commonPlugins,
        external: ['react', 'react-dom'],
        globals: {
            react: 'React',
            "react-dom": "ReactDOM",
        },
    }
]
