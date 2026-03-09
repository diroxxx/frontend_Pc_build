import { atomWithStorage } from 'jotai/utils';

export type Theme = 'dark' | 'light';

export const themeAtom = atomWithStorage<Theme>('pc-build-theme', 'dark');
