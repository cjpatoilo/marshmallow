#!/usr/bin/env node
const rasper = require('rasper')
const app = require('./')
const { version } = require('./package.json')
const options = process.argv[0].match(/node/i) ? rasper(process.argv.slice(2)) : rasper()

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

if (require.main === module) {
	app(options)
}

