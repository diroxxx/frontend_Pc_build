import { atom } from "jotai";
import type { ComponentItem } from "../../../../shared/dtos/BaseItemDto";
export const showUpdateComponentModalAtom = atom<boolean>(false);
export const editingComponentAtom = atom<ComponentItem | null>(null);
export const componentIdToDeleteAtom = atom<number | null>(null);

