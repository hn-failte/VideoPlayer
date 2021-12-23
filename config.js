const path = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const less = require('rollup-plugin-less')
const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')
const { babel } = require('@rollup/plugin-babel')
const version = process.env.VERSION || require('./package.json').version

const banner =
  '/*!\n' +
  ` * VideoPlayer v${version}\n` +
  ` * (c) 2021-${new Date().getFullYear()} hn-failte\n` +
  ' * Released under the MIT License.\n' +
  ' */'

const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, './', p)
  }
}

const builds = {
  'video-player': {
    entry: resolve('src/index.ts'),
    dest: resolve('dist/video-player.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'custom-menu-plugin': {
    entry: resolve('src/plugins/videojs-custom-menu/plugin.ts'),
    dest: resolve('dist/custom-menu-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'videojs-marker-plugin': {
    entry: resolve('src/plugins/videojs-marker/plugin.ts'),
    dest: resolve('dist/videojs-marker-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'playlist-plugin': {
    entry: resolve('src/plugins/videojs-playlist/plugin.ts'),
    dest: resolve('dist/playlist-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'screenshot-plugin': {
    entry: resolve('src/plugins/videojs-screenshot/plugin.ts'),
    dest: resolve('dist/screenshot-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  }
}

function genConfig(name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [alias(Object.assign({}, aliases, opts.alias))].concat(opts.plugins || []),
    output: {
      ...(opts.dist ? { dir: opts.dist } : { file: opts.dest }),
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'VideoPlayer'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // built-in vars
  const vars = {
    __VERSION__: version
  }
  // build-specific env
  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(
    ...(opts.env === 'development' ? [cjs(), nodeResolve()] : []),
    replace(vars),
    less({
      output: resolve('dist/VideoPlayer.css')
    }),
    typescript({
      tsconfigDefaults: { compilerOptions: { declaration: true } },
      tsconfig: 'tsconfig.json',
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    babel({ babelHelpers: 'bundled' }),
    terser()
  )

  if (opts.transpile !== false) {
    config.plugins.push(buble())
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
