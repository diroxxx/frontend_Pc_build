import {atom} from "jotai";

export const viewModeAtom = atom<"list" | "grid">("list")