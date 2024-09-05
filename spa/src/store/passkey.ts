import {atom} from "jotai";

export const hasComeFromUpliftDialogAtom = atom<boolean>(false);

export let hasUplifted = false;

export function setHasUplifted() {
  hasUplifted = true;
}
