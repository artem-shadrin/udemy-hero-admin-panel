// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { useHttp } from "../../hooks/http.hook";

// const initialState = {
//   filters: [],
//   filtersLoadingStatus: "idle",
//   activeFilter: "all",
// };
// export const filtersFetch = createAsyncThunk(
//   "filters/fetchFilters",
//   async () => {
//     const { request } = useHttp();
//     return await request("http://localhost:3001/filters");
//   }
// );

// const filtersSlice = createSlice({
//   name: "filters",
//   initialState,
//   reducers: {
//     filterActiveChanged: (state, action) => {
//       state.activeFilter = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(filtersFetch.pending, (state) => {
//         state.filtersLoadingStatus = "loading";
//       })
//       .addCase(filtersFetch.fulfilled, (state, action) => {
//         state.filters = action.payload;
//         state.filtersLoadingStatus = "idle";
//       })
//       .addCase(filtersFetch.rejected, (state) => {
//         state.filtersLoadingStatus = "error";
//       })
//       .addDefaultCase(() => {});
//   },
// });

// export default filtersSlice.reducer;
// export const { filterActiveChanged } = filtersSlice.actions;

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";
const filtersAdapter = createEntityAdapter();
const initialState = filtersAdapter.getInitialState({
  filtersLoadingStatus: "idle",
  activeFilter: "all",
});

export const fetchFilters = createAsyncThunk(
  "filters/fetchFilters",
  async () => {
    const { request } = useHttp();
    return await request("http://localhost:3001/filters");
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    filterActiveChanged: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.filtersLoadingStatus = "loading";
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filtersLoadingStatus = "idle";
        filtersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilters.rejected, (state) => {
        state.filtersLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

export const { selectAll } = filtersAdapter.getSelectors(
  (state) => state.filters
);

export default filtersSlice.reducer;
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  filterActiveChanged,
} = filtersSlice.actions;
