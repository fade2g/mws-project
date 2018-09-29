import { processQueue } from "./queue";

export default class OnlineHandler {
  constructor(serviceWorker) {
    this.serviceWorker = serviceWorker;
  }
 
  attachListener() {
    this.serviceWorker.addEventListener("online", () => {
      processQueue();
    });
  }
}
