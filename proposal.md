
## Proposal for the `elm-pkg-js` specification.


### Overview

An `elm-pkg-js` compliant package called `author-name/my-package` must:

1. Include its JS in a single, un-minified `src/my-package.js` source file
2. Export an async `init` function, that takes an instantiated Elm application as argument
3. Provide type signatures for any `in` or `out` ports it depends on, as well as any imports required for the port signatures.

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
- `martinsstewart_elm_audio`: lowercase
- add `to_js` and `from_js` suffixes:
   - `martinsstewart_elm_audio_to_js`
   - `martinsstewart_elm_audio_from_js`

Then the following ports file definition is set at the top of the JS file.

```javascript
/* elm-pkg-js
import Audio
import Json.Encode
port martinsstewart_elm_audio_to_js : Json.Encode.Value -> Cmd (Audio.Msg msg)
port martinsstewart_elm_audio_from_js : (Json.Encode.Value -> Audio.Msg msg) -> Sub (Audio.Msg msg)
*/
```

If the package uses no ports, there is an empty annotation:

```javascript
/* elm-pkg-js
*/
```


### Tooling auto-generation

A tool for automating inclusion of `elm-pkg-js` packages would:

- Create an `elm-pkg-js` folder
- For each package's included JS, copy it to `elm-pkg-js/<package-name>-<version>.js`
- Generate the `elm-pkg-js-includes.js` entrypoint file
- Generate a `src/PkgPorts.elm` file with all the ports and signatures specified by `elm-pkg-js` packages

The UI might look something like this:

```
elm-pkg-js install supermario/copy-to-clipboard

───> Validating...
───> Running `elm install supermario/copy-to-clipboard`
...
───> Adding package Javascript

-- UNTRUSTED JAVASCRIPT --------------------------------------------------------

This package includes 45 lines of Javascript, which you can review here:

<https://github.com/supermario/elm-pkg-js/blob/d7f937c6f7638b1a730b4d4361ac23a7d2673330/examples/copy-to-clipboard/src/copy-to-clipboard.js>

Are you sure you want to add this to elm-pkg-js-includes.js? [Y/N] y

───> Generating elm-pkg-js-includes.js (45 lines total)
───> Generating PkgPorts.elm

The package is now ready to use.

If this is your first `elm-pkg-js` addition, follow the setup steps:

https://github.com/supermario/elm-pkg-js/blob/master/setup.md
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
