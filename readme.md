<a align="center" href="https://github.com/cjpatoilo/marshmallow"><img width="100%" src="https://cjpatoilo.com/marshmallow/artwork.png" alt="README Parser – easy as marshmallow!"></a>

> README Parser – easy as marshmallow!

[![Travis Status](https://travis-ci.org/cjpatoilo/marshmallow.svg?branch=master)](https://travis-ci.org/cjpatoilo/marshmallow?branch=master)
[![AppVeyor Status](https://ci.appveyor.com/api/projects/status/rq1lwhaea31u7sq9?svg=true)](https://ci.appveyor.com/project/cjpatoilo/marshmallow)
[![Codacy Status](https://img.shields.io/codacy/grade/e5fa9acbf7b14b92bdeef938112e4e3d/master.svg)](https://www.codacy.com/app/cjpatoilo/marshmallow/dashboard)
[![Dependencies Status](https://david-dm.org/cjpatoilo/marshmallow/status.svg)](https://david-dm.org/cjpatoilo/marshmallow)
[![Version Status](https://badge.fury.io/js/marshmallow.svg)](https://www.npmjs.com/package/marshmallow)
[![Download Status](https://img.shields.io/npm/dt/marshmallow.svg)](https://www.npmjs.com/package/marshmallow)
[![Gitter Chat](https://img.shields.io/badge/gitter-join_the_chat-4cc61e.svg)](https://gitter.im/cjpatoilo/marshmallow)


## Why it's awesome

Marshmallow create a minimalist documentation using Milligram. Ease to use. No config. No headache. Parser `README.md` to `index.html` so easy to prepare as marshmallow!


## Install

**Install with npm**

```sh
$ npm install marshmallow
```

**Install with Yarn**

```sh
$ yarn add marshmallow
```

**Run with npx (without installing)**

```sh
npx marshmallow
```

## Usage

```
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
		-t, --color             Set color theme
		-t, --url               Set homepage
		-f, --force             Force overwrite

	Examples:

		$ marshmallow
		$ marshmallow --output documentation // documentation/index.html
		$ marshmallow --output docs/index.html

	Default settings when no options:

		$ marshmallow --output index.html --readme README.md --minify true
```

Note: Has PSD support.


## Contributing

Want to contribute? Follow these [recommendations](.github/contributing.md).


## License

Designed with ♥ by [CJ Patoilo](https://twitter.com/cjpatoilo). Licensed under the [MIT License](license).
