
import type {ComputerDto} from "../types/ComputerDto.ts";
import {atom} from "jotai";

export const computersAtom = atom<ComputerDto[]>([]);

export const selectedComputerAtom = atom<ComputerDto | null>(null);

export const selectedComputerIndexAtom = atom<number | null>(null);

