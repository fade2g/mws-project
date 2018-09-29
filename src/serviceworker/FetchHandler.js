/**
 * Base class for service worker fetch handlers
 * A fetchhandler mus implement the methods "test" and "handle"
 */
export default class FetchHandler {

  /**
   * Constructor for the base class for fetch handlers
   * @param {Object} options Object containing options as needed by the handler implementation
   * @returns {FetchHandler}
   */
  constructor(options) {
    const defaultOptions = { serviceWorkerOption: {} };
    this.options = Object.assign({}, defaultOptions, options); // eslint-disable-line prefer-object-spread
  }

  log(message, additional) {
    if (additional) {
      console.log(`${this.constructor.name}: ${message}`, additional); // eslint-disable-line no-console
    } else {
      console.log(`${this.constructor.name}: ${message}`); // eslint-disable-line no-console
    }
  }

  /**
   * Ths method assignes the fetch event to the handler
   * @param {Event} event Fetch event to be handled
   */
  withEvent(event) {
    this.event = event;
    return this;
  }

  /* eslint-disable class-methods-use-this */
  test() {
    return false;
  }
  /* eslint-enable class-methods-use-this */

  urlFromRequest() {
    return new URL(this.event.request.url);
  }

  getRequest() {
    return this.event.request;
  }

  handle() {
    let url = this.urlFromRequest();
    this.event.respondWith(fetch(this.event.request));
  }
}
