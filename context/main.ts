import { createSlice } from '@reduxjs/toolkit';

import { InitialStateType } from './storeTypes';

const initialState: InitialStateType = { rssData: {} };

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setRssData(state, { payload }) {
      state.rssData = payload;
    },
  },
});

export const { setRssData } = mainSlice.actions;

export default mainSlice;
