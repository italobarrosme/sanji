import { create } from 'zustand';

type CustomizerStore = {
  isOpen: boolean;
  toggle: () => void;
  setColor: (color: string) => void;
  currentColor: string;
  currentDecal: string;
  setDecal: (decal: string) => void;
}

export const useCustomizerStore = create<CustomizerStore> ((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setColor: (color) => set(() => ({ currentColor: color })),
  currentColor: '#ccc',
  currentDecal: 'cd',
  setDecal: (decal) => set(() => ({ currentDecal: decal }))
}))