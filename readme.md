### NOT FOR SHARING. Do not post on reddit, twitter, HN, discourse, slack, etc.


# `elm-pkg-js`

_**A standard for shipping simple JS with Elm Packages**_


This repo explores the possibility of an API/standard/spec for Elm packages that provide JS/ports, as well as tooling to make adding that JS/ports to projects seamless and (fully!) type safe.



## Problem statement

There are a number of common cases where Elm still requires external JS that haven't been codified in an `elm/*` or `elm-explorations/*` package.

Examples are:

- Browser Media APIs (i.e. Audio)
- Copy paste
- Localstorage
- Websockets
- Internationalization



### Problem: Packages providing JS

Until such a time as all these usecases are provided by official packages, most packages that explore this domain require some JS glue to provide the extra integration via ports or webcomponents, and a manual specification of which Elm ports are required, with what types, and how to set them up.

Right now there is no standard for doing this in the community, so it's a manual and ad-hoc process that varies wildly depending on the package.

There are a number of existing libraries for port interop (see Prior Art) but none meet the desired design goals below.



## Scope

Initially the goal is this works with something non-intrusive i.e. Parcel. The idea is being tested out by a few people experimentally with [Lamdera](https://lamdera.com).

If we're happy with the design, it might make sense to share it with Elm community on Discourse as a general proposal for "packages-including-JS".

In that broader context, it would probably be nice to have this system work nicely regardless of JS bundling/minification approaches (webpack, parcel, gulp, browserify, etc).



## Design goals

A "standardised" approach for providing JS alongside Elm packages, that would have:

- Clearly specified interface for providing JS functionality alongside an Elm package
  - The location and naming of the JS
  - The naming and API/types for the ports
- Ability to find out at "compile time" (not at runtime) issues such as:
  - If the port names in the package and the port names in the app mismatch
  - If the port names from the package are missing port declarations in the app entirely
  - If the type of the ports does not match the API specified by the package
- Easily auto-hooked up into a project, perhaps with a small external tool, in an idempotent way
- Mechanism to provide warnings/overviews when the package author has modified the included JS

We'll refine these goals as we learn more.



## General goals

- Greater accessibility for packages-with-JS
- Much better comparability of the functionality and APIs of packages-with-JS
- Get us closer to the notion of "good" candidate packages to be possibly included into `elm/*` or `elm-explorations/*` with Kernel code in future, or at least clearly showcase the gaps/limitations without
- Open up possibility for community-reviewed and vetted JS
- Support existing Elm philosophy on JS integration with improved ergonomics
- Simpler security considerations when evaluating an elm-pkg-js package, in contrast to `npm`.


## Proposal

Check out the [Proposal](proposal.md) for a work-in-progress description of the specification and tooling behaviour.


## Examples

See the [examples](https://github.com/supermario/elm-pkg-js/tree/master/examples) folder for Elm packages that include `elm-pkg-js spec` compliant JS as per the [Proposal](proposal.md).


## Clarifications

### "Compile time"

`elm-pkg-js` would be a specialised tool, i.e similar to [elm-json](https://github.com/zwilias/elm-json#readme). So "compile time" in this context means "when the user runs `elm-pkg-js`", and not some extension to the Elm compiler.

In the Lamdera context, we'd possibly bake this functionality directly into the `lamdera` binary, so "compile time" would actually mean compile time in that specific application.

In either case, the design goals would ideally be the same, and work against the same specification.


### Non-package JS

This initiative isn't about solving "user-added JS" (in contrast to "package-added JS"), though perhaps a design here might lead to a nice encapsulation of user JS for some circumstances too.

When user JS in a project comes into play we also have to consider their entire environment, which is extremely difficult to unify for (i.e. say user project is Rails as a backend and Webpack as build, or some completely different environment we don't anticipate, or they're injecting Elm progressively into an existing JS app with it's own setup, assumptions, build pipeline, etc).

Lamdera has no user written JS so the surface area is much more constrained and manageable.



### Prior art

#### [billstclair/elm-port-funnel](https://package.elm-lang.org/packages/billstclair/elm-port-funnel/latest/)

Bill St. Clair has the [elm-port-funnel](https://package.elm-lang.org/packages/billstclair/elm-port-funnel/latest/) package, which aligns with some of the problem statement here;

> billstclair/elm-port-funnel allows you to use a single outgoing/incoming pair of ports to communicate with the JavaScript for any number of PortFunnel-aware modules, which I'm going to call "funnels".

The downsides to this approach are:

- The user needs to manage integrating the port + package as a "component" (i.e. manually tracking additional 3rd party model state and messages).
- It doesn't work for packages that want to act as frameworks/wrappers (i.e. elm-audio).


#### [ursi/SupPort](https://github.com/ursi/support)

> SupPort is a small framework for Elm ports. It uses the "one port pair per actor" approach and aims to make it as delightful as possible. There is also a JavaScript component to this as well, which is available [here](https://github.com/ursi/support-js).

This approach appears to be more suited to solving the stated problem, but still has a few gaps:

- Same as `elm-port-funnel` it expects the user will be managing the operational model+msg
- Because it's setup with the expectation of user involvement, it doesn't seem as amenable to auto-linking as it could be
- Might serve as a good starting point but needs more research

#### [peterszerzo/elm-porter](https://package.elm-lang.org/packages/peterszerzo/elm-porter/latest/)

Was pointed out on Elm Slack, is specifically aimed at request/response modelling with ports but could be good to look over.

Note: unsuitable as it expects functions to be stored in the msg and model types.


#### [elm-community/js-integration-examples](https://github.com/elm-community/js-integration-examples)

This repository doesn't directly address any of the above design points but it does have sample JS integrations that we can validate against whatever candidate solutions we come up with here.
