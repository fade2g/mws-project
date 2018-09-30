/**
 * Base class for message handlers that receieve a message from the service worker
 */
export default class ServiceWorkerMessageHandler {
  withMessageType(messageType) {
    this.messageType = messageType;
    return this;
  }

  withSkipEmpty(skipEmpty) {
    this.skipEmpty = skipEmpty;
    return this;
  }

  withHandler(handlerFunction) {
    this.handlerFunction = handlerFunction;
    return this;
  }

  listener() {
    return event => {
      if (!event.data) {
        return;
      }
      const data = JSON.parse(event.data);
      if (data.type !== this.messageType) {
        return;
      }
      if (!data.payload && this.skipEmpty) {
        return;
      }
      this.handlerFunction(data.payload);
    };
  }
}
