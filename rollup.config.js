import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/sidebar.min.js',
    format: 'umd',
    name: 'Sidebar'
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: 'sidebar.min.css',
      minimize: true
    }),
    terser()
  ]
}
