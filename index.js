#!/usr/bin/env node
const { exec } = require('child_process')
const { existsSync } = require('fs')
const { basename, dirname, extname, resolve } = require('path')
const rasper = require('rasper')
const { Markdown } = require('markdown-to-html')
const { outputFile } = require('fs-extra')
const { open } = require('psd')
const { version } = require('./package.json')
const { error, info, warn } = console

const markdown = new Markdown()
const options = process.argv[0].match(/node/i) ? rasper(process.argv.slice(2)) : rasper()

if (require.main === module) marshmallow(options)

function marshmallow (options = {}) {
	const config = getConfig(options)

	if (config.help) {
		info(`
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
  -f, --force             Force overwrite

Examples:
  $ marshmallow
  $ marshmallow --output documentation // index.html
  $ marshmallow --output docs/index.html

Default settings when no options:
  $ marshmallow --output index.html --readme README.md --minify true
		`)
		process.exit(2)
	}

	if (config.version) {
		info('v' + version)
		process.exit(2)
	}

	if (!existsSync(config.readme)) {
		error('[error] README.md no exist!')
		process.exit(2)
	}

	if (!config.force && existsSync(config.output)) {
		warn('[warn] File output exist!')
		process.exit(2)
	}

	parse(config)
}

function generate (data, config) {
	const html = `
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,minimal-ui">
<meta name="robots" content="index, follow">
<meta name="author" content="${config.title}">
<meta name="description" content="${config.description}">
<meta property="og:description" content="${config.description}">
<meta property="og:image" content="${config.image}">
<meta property="og:locale" content="en">
<meta property="og:site_name" content="${config.title}">
<meta property="og:title" content="${config.title}">
<meta property="og:type" content="website">
<meta property="og:url" content="/">
<meta property="article:published_time" content="${new Date().toISOString()}">
<meta property="article:author" content="${config.title}">
<meta property="article:section" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:domain" content="${config.title}">
<meta name="twitter:url" content="/">
<meta name="twitter:site" content="/">
<meta name="twitter:creator" content="${config.title}">
<meta name="twitter:title" content="${config.title}">
<meta name="twitter:description" content="${config.description}">
<meta name="twitter:image:src" content="${config.image}">
<title>${config.title}</title>
<base href="/">
<link rel="canonical" href="/">
<link rel="image_src" href="${config.image}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.3.0/milligram.min.css">
<style>h2{font-size:2.8rem;line-height:1.3;}h2:nth-child(n+1){margin-top:15.0rem;}.container{max-width:80.0rem;}</style>
</head>
<body>
<div class="container">
${data}
</div>
</body>
</html>
	`
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('.psd', '.png') // fixit
		.replaceAll('\n\n', '')
		.replaceAll(config.minify, '')
		.replaceAll('<h2 id="license">License</h2>', '<h2 id="license"></h2>')

	outputFile(config.output, html, err => err ? error('[error] Error!') : copyImage(config.image, config.output))
}

function copyImage (input, output) {
	if (input.indexOf('cjpatoilo.com') !== -1) {
		process.exit(1)
	}
	if (!existsSync(input)) {
		error('[error] Image no exist!')
		process.exit(2)
	}
	if (extname(input) === '.psd') {
		open(input).then(psd => psd.image.saveAsPng(`${dirname(output)}/${basename(input, '.psd')}.png`))
	} else {
		exec(`cp ${resolve(__dirname, input)} ${dirname(output)}`)
	}
}

function parse (config) {
	markdown.bufmax = 100000
	markdown.render(config.readme, {}, err => err ? error(err) : markdown.on('data', data => generate(data, config)))
}

function output (value) {
	return extname(value).length ? resolve(value) : resolve(value, 'index.html')
}

function getConfig (options = {}) {
	return {
		help: options.help || options.h || false,
		version: options.version || options.v || false,
		output: output(options.output || options.o || 'index.html'),
		readme: options.readme || options.r || 'README.md',
		minify: options.minify || options.m ? '\n' : '',
		image: options.image || options.i || 'https://cjpatoilo.com/marshmallow/artwork.png',
		title: options.title || options.t || 'Marshmallow',
		description: options.description || options.d || 'README Parser – easy as marshmallow!',
		force: options.force || options.f
	}
}

/* eslint-disable */
String.prototype.replaceAll = function (find, replace) {
	const target = this
	return target.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace)
}
