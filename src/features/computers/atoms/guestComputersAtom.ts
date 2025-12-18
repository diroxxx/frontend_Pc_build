import {atomWithStorage} from "jotai/utils";
import type {ComputerDto} from "../../../shared/dtos/ComputerDto.ts";

export const guestComputersAtom = atomWithStorage<ComputerDto[]>('guestComputers',[])