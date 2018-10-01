import RestaurantsDataHandler from "./RestaurantsDataHandler";
import { UPDATE_OPTIONS_MESSAGE_TYPE } from "../shared/globals";
import { metadataUrlRegex } from "./constants";

export default class MetadataHandler extends RestaurantsDataHandler {
  constructor(options) {
    if (typeof options.notify !== "function") {
      throw new Error("Missing notify function");
    }
    super(options);
  }

  getMessageType() {
    return UPDATE_OPTIONS_MESSAGE_TYPE;
  }

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return this.urlFromRequest().href.match(metadataUrlRegex);
  }
}
