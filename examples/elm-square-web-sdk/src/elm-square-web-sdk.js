/* @elm-pkg-js
port wolfadex_elm_square_web_sdk_to_js : () -> Cmd msg
 */

/**
 * We're using https://hybrids.js.org to create a basic
 * custom element wrapper around the Square Web Payments SDK.
 */

exports.init = async function (app) {
  // import("https://sandbox.web.squarecdn.com/v1/square.js").then(() => {
  //   import("https://unpkg.com/hybrids@^6").then((hybrids) => {
  //     initSquareWebSdk(app, hybrids);
  //   });
  // });

  /**
   * There are currently technical issues which prevent
   * using `import("https:...")` in elm-pkg-js. To work
   * around this you can inject script tags into the
   * page <head />.
   */
  var squareWebSdk = document.createElement("script");
  squareWebSdk.type = "text/javascript";
  squareWebSdk.src = "https://sandbox.web.squarecdn.com/v1/square.js";
  document.head.appendChild(squareWebSdk);

  var hybridsScript = document.createElement("script");
  hybridsScript.type = "module";
  hybridsScript.innerHTML = `
  import * as hybrids from "https://unpkg.com/hybrids@^6";
  window.hybrids = hybrids;`;
  document.head.appendChild(hybridsScript);

  // This delay is to give time for the injected scripts
  // to download and run. Not ideal, but it does work.
  setTimeout(() => initSquareWebSdk(app, window.hybrids), 1000);
};

function initSquareWebSdk(app, { define, html }) {
  // Generate a (semi) unique id for use later
  const elementId = `card-input-${Date.now().toString()}`;
  let _payments;
  let _card;

  // Define our custom element to wrap the Square card input
  define({
    // The name of the node in HTML land
    tag: "square-payment-card-input",
    applicationId: "",
    locationId: "",
    content: () => html`<div id="${elementId}">${attachCardInput}</div>`,
  });

  // This function allows us to attach to the DOM
  function attachCardInput(host) {
    // Create a new `payments` object
    _payments = Square.payments(host.applicationId, host.locationId);
    // Create a new `card` object
    _card = await _payments.card();
    // Attach the card to the DOM
    await _card.attach(`#${elementId}`);

    // Listen for request from Elm to generate a payment token
    app.ports.wolfadex_elm_square_web_sdk_to_js.subscribe(async function () {
      // Make sure the `card` object exists before trying to use it
      if (_card) {
        // Attempt to get a token
        const result = await _card.tokenize();
        // Send the response back to Elm by way of a custom event
        host.dispatchEvent(
          new CustomEvent("square-payment-token", { detail: result })
        );
      }
    });
  }
}
