import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import postcssModules from 'postcss-modules';
import autoprefixer from 'autoprefixer';
import {
  terser
} from 'rollup-plugin-terser';

import pkg from './package.json';

const sharedPlugins = [
  json({
    namedExports: false,
    compact: true,
  }),
  postcss({
    extract: false,
    minimize: true,
    plugins: [
      postcssModules({
        camelCase: true
      }),
      autoprefixer(),
    ],
  }),
  resolve({
    module: true,
  }),
  commonjs(),
];

const defaultPlugins = [
  typescript(),
  ...sharedPlugins,
  autoExternal(),
  babel({
    babelHelpers: 'runtime',
    exclude: ['node_modules/**'],
  }),
  terser()
]

const examplePlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  ...sharedPlugins,
  babel({
    babelHelpers: 'inline'
  }),
  terser()
]

export default [{
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: defaultPlugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    plugins: defaultPlugins
  },
  {
    input: 'example/app.jsx',
    output: {
      file: 'example/app-compiled.js',
      format: 'es',
      exports: 'named',
    },
    plugins: examplePlugins
  }
]
