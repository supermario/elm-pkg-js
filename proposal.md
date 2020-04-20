
### Proposal for the `elm-pkg-js` specification.


An elm-pkg-js package called `my-package` must:

1. Include its JS in a single, un-minified `src/my-package.js` source file.

2. Export an async `init` function, that takes an instantiated Elm application as argument.

  ```
  exports.init = async function init(app) {
      // package javascript goes here
  }
  ```

  The `async` allows for multiple elm-pkg-js packages to be loaded together without blocking, if desired.

  :warning: TODO: look into implications of async, what exactly is the Elm port init lifecycle and exactly when might we get race conditions for a slow-to-bind port?

3. Expect two mapped ports

  These ports should be named;

  - `myPackageJsIn`
  - `myPackageJsOut`

  The kebab-case becomes camel case. I.e. `some-really-long-package` would become `someReallyLongPackage` suffixed by `Js[In|Out]`.

  :warning: TODO: what, if anything, should be done for a package that doesn't use one port or either port, i.e. a webcomponent package?


### Tooling auto-generation

A tool for automating inclusion of `elm-pkg-js` packages might:

- Create an `elm-pkg-js` folder
- For each package's included JS, copy it to `elm-pkg-js/<package-name>-<version>.js`
- Generate a `src/Ports.elm` file with all the ports and signatures specified by `elm-pkg-js` packages

- Print out the JS needed i.e.
  ```
  // Here is the JS to include in your project root:

  // Require elm-pkg-js sources
  let elmAudio = require('./elm-pkg-js/elm-audio-3.0.1')
  let elmMonaco = require('./elm-pkg-js/elm-monaco-1.0.0')

  // Initialise all elm-pkg-js packages
  elmAudio.init(app)
  elmMonaco.init(app)
  ```


### Optional

These might not need to be part of the spec at all, but are interesting to note.

- Export an async `upgrade` function, that takes an instantiated Elm application as argument. This can be used in environments where hot-reload is used with type-change awareness.

  ```
  exports.init = async function init(app) {
      // package javascript goes here
  }
  ```

  For example, Lamdera would use this on hot-reload deployments to keep `elm-audio` object refs live between app versions.
