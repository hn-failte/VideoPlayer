const path = require('path')
const replace = require('rollup-plugin-replace')
const typescript = require('rollup-plugin-typescript2')
const { nodeResolve } =  require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const less = require('rollup-plugin-less');
const version = process.env.VERSION || require('./package.json').version
const { babel } = require('@rollup/plugin-babel')

const aliases = {
  src: path.resolve(__dirname, './', 'src')
}

const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, './', p)
  }
}

export default {
  input: {
    VideoPlayer: resolve('src/index.ts'),
    CustomMenuPlugin: resolve('src/plugins/videojs-custom-menu/plugin.ts'),
    markerPlugin: resolve('src/plugins/videojs-marker/plugin.ts'),
    playlistPlugin: resolve('src/plugins/videojs-playlist/plugin.ts'),
    screenshotPlugin: resolve('src/plugins/videojs-screenshot/plugin.ts'),
  },
  plugins: [
    ...( process.env.TARGET === 'dev' ? [
      commonjs(),
      nodeResolve(),
    ] : []),
    less({
      output: resolve('dist/VideoPlayer.css')
    }),
    typescript({
      tsconfigDefaults: { compilerOptions: { declaration: true } },
      tsconfig: "tsconfig.json",
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    babel({ babelHelpers: 'bundled' }),
    replace({
      __VERSION__: version
    })
  ],
  output: {
    dir: resolve('dist'),
    // file: opts.dest,
    format: 'es',
    // name: opts.moduleName || 'VideoPlayer'
  },
  onwarn: (msg, warn) => {
    if (!/Circular/.test(msg)) {
      warn(msg)
    }
  }
}
