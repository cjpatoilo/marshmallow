const { exec } = require('child_process')
const { existsSync } = require('fs')
const { basename, dirname, extname, resolve } = require('path')
const { Markdown } = require('markdown-to-html')
const { minify } = require('html-minifier')
const { outputFile } = require('fs-extra')
const { open } = require('psd')
const { error, warn } = console
const markdown = new Markdown()

module.exports = (options = {}) => {
	const config = getConfig(options)

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
<meta property="og:url" content="${config.url}">
<meta property="article:published_time" content="${new Date().toISOString()}">
<meta property="article:author" content="${config.title}">
<meta property="article:section" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:domain" content="${config.title}">
<meta name="twitter:url" content="${config.url}">
<meta name="twitter:site" content="${config.url}">
<meta name="twitter:creator" content="${config.title}">
<meta name="twitter:title" content="${config.title}">
<meta name="twitter:description" content="${config.description}">
<meta name="twitter:image:src" content="${config.image}">
<title>${config.title}</title>
<base href="${config.url}">
<link rel="canonical" href="${config.url}">
<link rel="image_src" href="${config.image}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.3.0/milligram.min.css">
<style>h2{font-size:2.8rem;line-height:1.3;}h2:nth-child(n+1){margin-top:15.0rem;}.container{max-width:80.0rem;}</style>
<style>:root{--main-color:${config.color};}.button,button,input[type='button'],input[type='reset'],input[type='submit']{background-color:var(--main-color);border-color:var(--main-color);}.button[disabled]:focus,.button[disabled]:hover,button[disabled]:focus,button[disabled]:hover,input[type='button'][disabled]:focus,input[type='button'][disabled]:hover,input[type='reset'][disabled]:focus,input[type='reset'][disabled]:hover,input[type='submit'][disabled]:focus,input[type='submit'][disabled]:hover{background-color:var(--main-color);border-color:var(--main-color)}.button.button-outline,button.button-outline,input[type='button'].button-outline,input[type='reset'].button-outline,input[type='submit'].button-outline{color:var(--main-color);}.button.button-outline[disabled]:focus,.button.button-outline[disabled]:hover,button.button-outline[disabled]:focus,button.button-outline[disabled]:hover,input[type='button'].button-outline[disabled]:focus,input[type='button'].button-outline[disabled]:hover,input[type='reset'].button-outline[disabled]:focus,input[type='reset'].button-outline[disabled]:hover,input[type='submit'].button-outline[disabled]:focus,input[type='submit'].button-outline[disabled]:hover{color:var(--main-color)}.button.button-clear,button.button-clear,input[type='button'].button-clear,input[type='reset'].button-clear,input[type='submit'].button-clear{color:var(--main-color)}.button.button-clear[disabled]:focus,.button.button-clear[disabled]:hover,button.button-clear[disabled]:focus,button.button-clear[disabled]:hover,input[type='button'].button-clear[disabled]:focus,input[type='button'].button-clear[disabled]:hover,input[type='reset'].button-clear[disabled]:focus,input[type='reset'].button-clear[disabled]:hover,input[type='submit'].button-clear[disabled]:focus,input[type='submit'].button-clear[disabled]:hover{color:var(--main-color)}pre{background:#f4f5f6;border-left:0.3rem solid var(--main-color);}input[type='email']:focus,input[type='number']:focus,input[type='password']:focus,input[type='search']:focus,input[type='tel']:focus,input[type='text']:focus,input[type='url']:focus,textarea:focus,select:focus{border-color:var(--main-color);}select:focus{background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 29 14" width="29"><path fill="var(--main-color)" d="M9.37727 3.625l5.08154 6.93523L19.54036 3.625"/></svg>')}a{color:var(--main-color);}</style>
</head>
<body>
<div class="container">
${data}
</div>
</body>
</html>
	`
		.trim()
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('.psd', '.png') // fixit
		.replaceAll('<h2 id="license">License</h2>', '<h2 id="license"></h2>')

	outputFile(config.output, minify(html, config.minify), err => {
		err ? error('[error] Error!') : copyImage(config.image, config.output)
	})
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
	return extname(value).length ? resolve(dirname(value), 'index.html') : resolve(value, 'index.html')
}

function readmeCheck (value) {
	if (!existsSync(value)) {
		error(`[error] ${value} no exist!`)
		process.exit(2)
	}

	return value
}

function colorCheck (value = '') {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value[0] === '#' ? value : '#' + value)
}

function getConfig (options = {}) {
	const minify = {
		collapseBooleanAttributes: true,
		removeComments: true,
		collapseWhitespace: true
	}

	return {
		output: output(options.output || options.o || 'index.html'),
		readme: readmeCheck(options.readme || options.r || 'readme.md'),
		minify: options.minify || options.m ? minify : {},
		image: options.image || options.i || 'https://cjpatoilo.com/marshmallow/artwork.png',
		title: options.title || options.t || 'Marshmallow',
		description: options.description || options.d || 'README Parser – easy as marshmallow!',
		color: colorCheck(options.color || options.c) || '#d1d1d1',
		url: options.url || options.u || '/',
		force: options.force || options.f
	}
}

/* eslint-disable */
String.prototype.replaceAll = function (find, replace) {
	const target = this
	return target.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace)
}
