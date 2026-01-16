import { create } from "zustand";

interface CompressSizes {
  before?: string;
  after?: string;
}

interface State {
  originalImg: string;
  compressImg: string;
  compressSizes: CompressSizes;
}
interface Actions {
  setCompressImg: (compressImg: State["compressImg"]) => void;
  setOriginalImg: (originalImg: State["compressImg"]) => void;
  setCompressSizes: (sizes: Partial<State["compressSizes"]>) => void;
}


const initialState: State = {
  originalImg: "",
  compressImg: "",
  compressSizes: {
    before: "",
    after: "",
  },
}

export const useCompressedStore = create<State & Actions>((set) => ({
  ...initialState,
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
