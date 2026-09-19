import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { TFeedsResponse } from '../../utils/burger-api';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
}
const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false
};

export const fetchFeed = createAsyncThunk<TFeedsResponse, void>(
  'feed/fetchFeed',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders ?? [];
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
      });
  }
});

export default feedSlice.reducer;
