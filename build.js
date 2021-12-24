const fs = require('fs')
const path = require('path')
const { rollup } = require('rollup')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

process.env.build_format = process.argv[2] || ''

const builds = require('./config')
  .getAllBuilds()
  .filter(b => (process.env.build_format ? b.output.format === process.env.build_format : true))

build(builds)

async function build(builds) {
  for (const build of builds) await buildEntry(build).catch(e => console.log(e))
}

function buildEntry(config) {
  const { output } = config
  return rollup(config)
    .then(bundle => bundle.write(output))
    .then(() => console.log(chalk(`${output.file} build success`, 'green')))
}

function chalk(str, type) {
  const head = '\x1b[1m'
  const foot = '\x1b[39m\x1b[22m'
  const getStr = c => head + c + str + foot
  return {
    white: getStr('\x1b[29m'),
    gray: getStr('\x1b[30m'),
    red: getStr('\x1b[31m'),
    green: getStr('\x1b[32m'),
    yellow: getStr('\x1b[33m'),
    blue: getStr('\x1b[34m'),
    purpose: getStr('\x1b[35m'),
    indigo: getStr('\x1b[36m')
  }[type]
}
