const path = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
// const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
// const { nodeResolve } = require('@rollup/plugin-node-resolve')
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
    dest: resolve('dist/es/video-player.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'custom-menu-plugin': {
    entry: resolve('src/plugins/videojs-custom-menu/plugin.ts'),
    dest: resolve('dist/es/custom-menu-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'marker-plugin': {
    entry: resolve('src/plugins/videojs-marker/plugin.ts'),
    dest: resolve('dist/es/marker-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'playlist-plugin': {
    entry: resolve('src/plugins/videojs-playlist/plugin.ts'),
    dest: resolve('dist/es/playlist-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'screenshot-plugin': {
    entry: resolve('src/plugins/videojs-screenshot/plugin.ts'),
    dest: resolve('dist/es/screenshot-plugin.js'),
    format: 'es',
    transpile: true,
    env: 'production',
    external: ['video.js'],
    banner
  },
  'video-player-umd': {
    entry: resolve('src/index.ts'),
    dest: resolve('dist/umd/video-player.umd.min.js'),
    format: 'umd',
    moduleName: 'VideoPlayer',
    transpile: false,
    env: 'production',
    external: ['video.js'],
    globals: {
      'video.js': 'videojs'
    },
    banner
  },
  'custom-menu-plugin-umd': {
    entry: resolve('src/plugins/videojs-custom-menu/plugin.ts'),
    dest: resolve('dist/umd/custom-menu-plugin.umd.min.js'),
    format: 'umd',
    moduleName: 'CustomMenuPlugin',
    transpile: false,
    env: 'production',
    external: ['video.js'],
    globals: {
      'video.js': 'videojs'
    },
    banner
  },
  'marker-plugin-umd': {
    entry: resolve('src/plugins/videojs-marker/plugin.ts'),
    dest: resolve('dist/umd/marker-plugin.umd.min.js'),
    format: 'umd',
    moduleName: 'MarkerPlugin',
    transpile: false,
    env: 'production',
    external: ['video.js'],
    globals: {
      'video.js': 'videojs'
    },
    banner
  },
  'playlist-plugin-umd': {
    entry: resolve('src/plugins/videojs-playlist/plugin.ts'),
    dest: resolve('dist/umd/playlist-plugin.umd.min.js'),
    format: 'umd',
    moduleName: 'PlaylistPlugin',
    transpile: false,
    env: 'production',
    external: ['video.js'],
    globals: {
      'video.js': 'videojs'
    },
    banner
  },
  'screenshot-plugin-umd': {
    entry: resolve('src/plugins/videojs-screenshot/plugin.ts'),
    dest: resolve('dist/umd/screenshot-plugin.umd.min.js'),
    format: 'umd',
    moduleName: 'ScreenshotPlugin',
    transpile: false,
    env: 'production',
    external: ['video.js'],
    globals: {
      'video.js': 'videojs'
    },
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
      globals: opts.globals,
      name: opts.moduleName
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
    // cjs(),
    // nodeResolve(),
    replace(vars),
    less({
      output: resolve(`dist/${opts.format}/${name}.css`)
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

exports.getBuild = genConfig
exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
