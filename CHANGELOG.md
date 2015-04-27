# changelog

## 0.3.3

* Allow non-Latin1 characters in sourcemaps ([#1](https://github.com/Rich-Harris/eval2/issues/1))

## 0.3.2

* More workarounds to prevent 'helpful' minifiers breaking everything

## 0.3.1

* `eval2.Function` can now accept an array of argument names - e.g. `fn = new eval2.Function(['a', 'b', 'c'], body)`
* `sourceMappingURL` string is split up, to avoid confusing sourcemap tools

## 0.3.0

* Rearchitect as ES6 module, available to ES6-aware systems via the `jsnext:main` field in package.json
* Replaced grunt with `npm run` scripts
* Started maintaining a changelog