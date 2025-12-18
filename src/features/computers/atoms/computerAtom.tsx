
import type {ComputerDto} from "../../../shared/dtos/ComputerDto.ts";
import {atom} from "jotai";

export const selectedComputerAtom = atom<ComputerDto | null>(null);


