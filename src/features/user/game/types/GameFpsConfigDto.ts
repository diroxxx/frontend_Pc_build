export type GameFpsConfigDto = {
    gameTitle: string;
    resolution: typeof resolutionList[number];
    graphicsPreset: typeof graphicsPresetList[number];
    technology: typeof technologyList[number];
    cpu: string;
    gpu: string;
};

export const resolutionList = ['720p', '1080p', '1440p', '4K'] as const;
export const graphicsPresetList = ['Low', 'Medium', 'High', 'Ultra'] as const;
export const technologyList = ['DLLS', 'DLAA', 'DLSS 2.0', 'DLSS 3.0', 'FSR 1.0', 'FSR 2.0', 'XeSS'] as const;