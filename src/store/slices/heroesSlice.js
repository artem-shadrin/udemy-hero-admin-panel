import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

import { useHttp } from "../../hooks/http.hook";

// const initialState = {
//   heroes: [],
//   heroesLoadingStatus: "idle",
// };

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: "idle",
});

export const fetchHeroes = createAsyncThunk("heroes/fetchHeroes", async () => {
  console.log("heroes");
  const { request } = useHttp();
  return await request("http://localhost:3001/heroes");
});
const heroesSlice = createSlice({
  name: "heroes",
  initialState,
  reducers: {
    heroCreated: (state, action) => {
      heroesAdapter.addOne(state, action.payload);
    },
    heroDeleted: (state, action) => {
      heroesAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.heroesLoadingStatus = "loading";
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        heroesAdapter.setAll(state, action.payload);
        state.heroesLoadingStatus = "idle";
      })
      .addCase(fetchHeroes.rejected, (state) => {
        state.heroesLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

const { selectAll } = heroesAdapter.getSelectors((state) => state.heroes);
export const filteredHeroesSelector = createSelector(
  (state) => state.filters.activeFilter,
  selectAll,
  (filter, heroes) => {
    if (filter === "all") return heroes;
    return heroes.filter((item) => item.element === filter);
  }
);
export default heroesSlice.reducer;
export const { heroCreated, heroDeleted } = heroesSlice.actions;
