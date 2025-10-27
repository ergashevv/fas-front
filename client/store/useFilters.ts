import { create } from "zustand";

interface FiltersState {
  gender: string[];
  ageRange: string[];
  categories: string[];
  colors: string[];
  priceRange: [number, number];
  sizes: string[];
  sort: string;
  search: string;
  setGender: (gender: string[]) => void;
  setAgeRange: (ageRange: string[]) => void;
  setCategories: (categories: string[]) => void;
  setColors: (colors: string[]) => void;
  setPriceRange: (priceRange: [number, number]) => void;
  setSizes: (sizes: string[]) => void;
  setSort: (sort: string) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

const initialState = {
  gender: [],
  ageRange: [],
  categories: [],
  colors: [],
  priceRange: [0, 500000] as [number, number],
  sizes: [],
  sort: "newest",
  search: "",
};

export const useFilters = create<FiltersState>((set) => ({
  ...initialState,
  setGender: (gender) => set({ gender }),
  setAgeRange: (ageRange) => set({ ageRange }),
  setCategories: (categories) => set({ categories }),
  setColors: (colors) => set({ colors }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSizes: (sizes) => set({ sizes }),
  setSort: (sort) => set({ sort }),
  setSearch: (search) => set({ search }),
  reset: () => set(initialState),
}));
