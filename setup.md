
#### Setting up `elm-pkg-js` in a Javascript project.

Elm packages that follow the `elm-pkg-js` spec provide Port based functionality that relies on some external Javascript.

`elm-pkg-js` automates the retrieval, verification and inclusion of that Javascript.

Usage:

```javascript
import { init as elmPkgJsInit } from "./elm-pkg-js-includes"

// After your Elm app has been initialised as you normally do
var app = Elm.Main.init(...)

// Pass it to the generated elm-pkg-js initialiser
elmPkgJsInit(app)
```

Now the provided `init` function for all installed `elm-pkg-js` packages will be run, allowing port subscriptions to be attached.


#### Verifying `elm-pkg-js` Javascript contents

```
elm-pkg-js verify

───> Validating `elm-pkg-js` compliance
───> Overview for (1) elm-pkg-js package:

supermario/copy-to-clipboard v1.0.0

  Package: https://package.elm-lang.org/packages/supermario/copy-to-clipboard/1.0.0/
  Repo:    https://github.com/supermario/copy-to-clipboard
  JS:      https://github.com/supermario/copy-to-clipboard/src/copy-to-clipboard.js

           45 lines
           34 lines of Javascript

```
