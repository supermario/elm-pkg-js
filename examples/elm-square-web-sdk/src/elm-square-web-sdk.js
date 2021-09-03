/* @elm-pkg-js
port wolfadex_elm_square_web_sdk_to_js : () -> Cmd msg
 */

/**
 * We're using https://www.fast.design/docs/fast-element/getting-started to create a basic
 * custom element wrapper around the Square Web Payments SDK.
 */

exports.init = async function (app) {
  // import("https://sandbox.web.squarecdn.com/v1/square.js").then(() => {
  //   import("hhttps://unpkg.com/@microsoft/fast-element").then((FAST) => {
  //     initSquareWebSdk(app, FAST);
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

  var fastScript = document.createElement("script");
  fastScript.type = "module";
  fastScript.innerHTML = `
  import * as FAST from "https://unpkg.com/@microsoft/fast-element";
  window.FAST = FAST;`;
  document.head.appendChild(fastScript);

  // This delay is to give time for the injected scripts
  // to download and run. Not ideal, but it does work.
  setTimeout(() => initSquareWebSdk(app, window.FAST), 1000);
};

function initSquareWebSdk(app, { FASTElement, html }) {
  // Generate a (semi) unique id for use later
  const elementId = `card-input-${Date.now().toString()}`;
  // Define a template for the view of the element
  const template = html`<span id="${elementId}"></span>`;
  
  class SquarePaymentCardInput extends FASTElement {
      static definition = {
        name: "square-payment-card-input",
        shadowOptions: null, // We can't use ShadowDOM because it hides the target element from the Square SDK
        template: template,
        // Define the attributes we need to pass in
        attributes: ["application-id", "location-id"],
      };

      async connectedCallback() {
        super.connectedCallback();
        
        // Build out Square card input
        const payments = Square.payments(
          this.getAttribute("application-id"),
          this.getAttribute("location-id")
        );
        const card = await payments.card({
          style: this.styling,
        });
        await card.attach(`#${elementId}`);
        app.ports.wolfadex_elm_square_payment_form_to_js.subscribe(async () => {
          const result = await card.tokenize();
          this.dispatchEvent(
            new CustomEvent("square-payment-token", { detail: result })
          );
        });
      }
    }
    FASTElement.define(SquarePaymentCardInput);
}
