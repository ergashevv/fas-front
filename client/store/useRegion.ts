import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RegionCode =
  | "UZ-TCC" | "UZ-TOS" | "UZ-SAM" | "UZ-AND" | "UZ-NAM" | "UZ-FER" | "UZ-BUK" | "UZ-JIZ" | "UZ-SIR" | "UZ-NAV" | "UZ-QAS" | "UZ-SUR" | "UZ-XOR" | "UZ-QRP";

interface RegionState {
  code: RegionCode | null;
  name: string | null;
  setRegion: (code: RegionCode, name: string) => void;
}

export const useRegion = create<RegionState>()(
  persist(
    (set) => ({
      code: null,
      name: null,
      setRegion: (code, name) => set({ code, name }),
    }),
    { name: "fas.region" }
  )
);