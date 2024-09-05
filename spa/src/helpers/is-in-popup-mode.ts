import {getMode} from "@/store";

export function isInPopupMode() {
  return getMode() === "popup";
}
