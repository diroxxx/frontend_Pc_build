
export type GameReqCompDto = {
    id: number;
    title: string;
    imageUrl: string | null;
    cpuSpecs: CpuRecDto[];
    gpuSpecs: GpuRecDto[];
}

export type GpuRecDto = {
    gpuModelId: number;
    gpuModel: string;
    recGameLevel?: RecGameLevel;
}
export type CpuRecDto = {
    processorId: number;
    processorModel: string;
    recGameLevel?: RecGameLevel;
}

export enum RecGameLevel {
    MIN = "MIN", REC = "REC"
}

export const recLevels = [RecGameLevel.MIN, RecGameLevel.REC];