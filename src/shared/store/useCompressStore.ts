import { create } from "zustand";

interface CompressSizes {
  before?: string;
  after?: string;
}

interface CompressState {
  originalImg: string;
  compressImg: string;
  compressSizes: CompressSizes;
  setCompressImg: (img: string) => void;
  setOriginalImg: (img: string) => void;
  setCompressSizes: (sizes: Partial<CompressSizes>) => void;
}

export const useCompressedStore = create<CompressState>((set) => ({
  originalImg: "",
  compressImg: "",
  compressSizes: {
    before: "",
    after: "",
  },
  setOriginalImg: (img) => set({ originalImg: img }),
  setCompressImg: (img) => set({ compressImg: img }),
  setCompressSizes: (sizes) =>
    set((state) => ({
      compressSizes: {
        ...state.compressSizes,
        ...sizes,
      },
    })),
}));
