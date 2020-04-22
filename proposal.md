
## Proposal for the `elm-pkg-js` specification.


### Overview

An `elm-pkg-js` compliant package called `author-name/my-package` must:

1. Include its JS in a single, un-minified `src/my-package.js` source file
2. Export an async `init` function, that takes an instantiated Elm application as argument
3. Provide a type signature for any `in` or `out` ports it depends on

The details are elaborated below.

#### 1. Include its JS in a single, un-minified `src/my-package.js` source file

TODO: #4


#### 2. Export an async `init` function, that takes an instantiated Elm application as argument

```
exports.init = async function init(app) {
    // package javascript goes here
}
```

The `async` allows for multiple `elm-pkg-js` packages to be loaded together without blocking each other. TODO: #3.


#### 3. Provide a commented type signature for any `in` or `out` ports it depends on

The following transformation from package name to port name happens:

- `MartinSStewart/elm-audio`: given a full Elm package name
- `MartinSStewart_elm_audio`: replace any non `[a-zA-Z-]` with `_`
- `martinsstewart_elm_audio`: lowercase to make it harder to make typos
- add suffixes:
   - `martinsstewart_elm_audio_js_in`
   - `martinsstewart_elm_audio_js_out`

Then the following port definitions are set at the top of the JS file.

```
// port martinsstewart_elm_audio_js_in : (Json.Value -> msg) -> Sub msg
// port martinsstewart_elm_audio_js_out : Json.Value -> Cmd msg
```

If the package uses no ports, there are no port annotations.


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
