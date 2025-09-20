import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/s-boostrap.min.js',
    format: 'umd',
    name: 'S-Boostrap'
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: 's-boostrap.min.css',
      minimize: true
    }),
    terser()
  ]
}
