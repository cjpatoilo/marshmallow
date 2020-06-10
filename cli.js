#!/usr/bin/env node
const { existsSync } = require('fs')
const { resolve } = require('path')
const rasper = require('rasper')
const app = require('./')
const { version } = require('./package.json')
const options = process.argv[0].match(/node/i)
  ? rasper(process.argv.slice(2))
  : rasper()
const mainPackage = resolve(__dirname, '../../package.json')

if (options.help || options.h) {
  console.info(`
Usage:

  $ marshmallow [<options>]

Options:

  -h, --help              Display help information
  -v, --version           Output version
  -o, --output            Set output
  -r, --readme            Set README.md file
  -m, --minify            Minify HTML
  -a, --author            Set author
  -i, --image             Set image
  -t, --title             Set title
  -d, --description       Set description
  -c, --color             Set color theme
  -u, --url               Set homepage
  -f, --force             Force overwrite

Examples:

  $ marshmallow
  $ marshmallow --output documentation // index.html
  $ marshmallow --output docs/index.html

Default settings when no options:

  $ marshmallow --output index.html --readme README.md --minify true
`)
  process.exit(1)
}

if (options.version || options.v) {
  console.info('v' + version)
  process.exit(1)
}

if (existsSync(mainPackage)) {
  const { author, description, homepage, name } = require(mainPackage)

  if (!options.a || !options.author) options.author = author
  if (!options.d || !options.description) options.description = description
  if (!options.u || !options.url) options.url = homepage
  if (!options.t || !options.title) options.title = parserPackageName(name)

  function parserPackageName (name = '') {
    return name
      .toLowerCase()
      .replace(new RegExp('-', 'g'), ' ')
      .replace(new RegExp('_', 'g'), ' ')
      .split(' ')
      .map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
      .join(' ')
  }
}

if (require.main === module) {
  app(options)
}
