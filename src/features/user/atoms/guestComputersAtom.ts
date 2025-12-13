import {atomWithStorage} from "jotai/utils";
import type {ComputerDto} from "../../../types/ComputerDto.ts";

export const guestComputersAtom = atomWithStorage<ComputerDto[]>('guestComputers',[])