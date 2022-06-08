/* elm-pkg-js */

exports.init = function(app) {

  var mathjaxJs = document.createElement('script')
  mathjaxJs.type = 'text/javascript'
  mathjaxJs.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'
  document.head.appendChild(mathjaxJs);

}

MathJax = {
  tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
  options: {
    skipHtmlTags: {'[+]': ['math-element']}
  },
  startup: {
    ready: () => {
      //
      //  Get some MathJax objects from the MathJax global
      //
      //  (Ideally, you would turn this into a custom component, and
      //  then these could be handled by normal imports, but this is
      //  just an example and so we use an expedient method of
      //  accessing these for now.)
      //
      const mathjax = MathJax._.mathjax.mathjax;
      const HTMLAdaptor = MathJax._.adaptors.HTMLAdaptor.HTMLAdaptor;
      const HTMLHandler = MathJax._.handlers.html.HTMLHandler.HTMLHandler;
      const AbstractHandler = MathJax._.core.Handler.AbstractHandler.prototype;
      const startup = MathJax.startup;

      //
      //  Extend HTMLAdaptor to handle shadowDOM as the document
      //
      class ShadowAdaptor extends HTMLAdaptor {
        create(kind, ns) {
          const document = (this.document.createElement ? this.document : this.window.document);
          return (ns ?
                  document.createElementNS(ns, kind) :
                  document.createElement(kind));
        }
        text(text) {
          const document = (this.document.createTextNode ? this.document : this.window.document);
          return document.createTextNode(text);
        }
        head(doc) {
          return doc.head || (doc.firstChild || {}).firstChild || doc;
        }
        body(doc) {
          return doc.body || (doc.firstChild || {}).lastChild || doc;
        }
        root(doc) {
          return doc.documentElement || doc.firstChild || doc;
        }
      }

      //
      //  Extend HTMLHandler to handle shadowDOM as document
      //
      class ShadowHandler extends HTMLHandler {
        create(document, options) {
          const adaptor = this.adaptor;
          if (typeof(document) === 'string') {
            document = adaptor.parse(document, 'text/html');
          } else if ((document instanceof adaptor.window.HTMLElement ||
                      document instanceof adaptor.window.DocumentFragment) &&
                     !(document instanceof window.ShadowRoot)) {
            let child = document;
            document = adaptor.parse('', 'text/html');
            adaptor.append(adaptor.body(document), child);
          }
          //
          //  We can't use super.create() here, since that doesn't
          //    handle shadowDOM correctly, so call HTMLHandler's parent class
          //    directly instead.
          //
          return AbstractHandler.create.call(this, document, options);
        }
      }

      //
      //  Register the new handler and adaptor
      //
      startup.registerConstructor('HTMLHandler', ShadowHandler);
      startup.registerConstructor('browserAdaptor', () => new ShadowAdaptor(window));

      //
      //  A service function that creates a new MathDocument from the
      //  shadow root with the configured input and output jax, and then
      //  renders the document.  The MathDocument is returned in case
      //  you need to rerender the shadowRoot later.
      //
      MathJax.typesetShadow = function (root) {
        const InputJax = startup.getInputJax();
        const OutputJax = startup.getOutputJax();
        const html = mathjax.document(root, {InputJax, OutputJax});
        html.render();
        return html;
      }

      //
      //  Now do the usual startup now that the extensions are in place
      //
      MathJax.startup.defaultReady();


      class MathText extends HTMLElement {

         // The "set content" code below detects the
         // argument to the custom element
         // and is necessary for innerHTML
         // to receive the argument.
         set content(value) {
           this.innerHTML = value
         }

        connectedCallback() {
          this.attachShadow({mode: "open"});
          this.shadowRoot.innerHTML =
            '<mjx-doc><mjx-head></mjx-head><mjx-body>' + this.innerHTML + '</mjx-body></mjx-doc>';
             MathJax.typesetShadow(this.shadowRoot)
             // setTimeout(() => MathJax.typesetShadow(this.shadowRoot), 1);
        }
      }

      customElements.define('math-text', MathText)


      class MathTextDelayed extends HTMLElement {

         // The "set content" code below detects the
         // argument to the custom element
         // and is necessary for innerHTML
         // to receive the argument.
         set content(value) {
           this.innerHTML = value
         }

        connectedCallback() {
          this.attachShadow({mode: "open"});
          this.shadowRoot.innerHTML =
            '<mjx-doc><mjx-head></mjx-head><mjx-body>' + this.innerHTML + '</mjx-body></mjx-doc>';
             setTimeout(() => MathJax.typesetShadow(this.shadowRoot), 1);
          }
      }

      customElements.define('math-text-delayed', MathTextDelayed)

    }
  }
};
