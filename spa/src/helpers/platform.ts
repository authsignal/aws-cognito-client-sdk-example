import {isWebKit} from "@react-aria/utils";

export function isIframeInSafari() {
  return window.self !== window.top && isWebKit();
}
