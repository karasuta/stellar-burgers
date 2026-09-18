import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

export interface IOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orders: TOrder[];
  orderByNumber: TOrder | null;
}

const initialState: IOrderState = {
  orderRequest: false,
  orderModalData: null,
  orders: [],
  orderByNumber: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return {
        _id: response.order._id,
        status: response.order.status,
        name: response.order.name,
        owner: response.order.owner,
        createdAt: response.order.createdAt,
        updatedAt: response.order.updatedAt,
        number: response.order.number,
        price: response.order.price,
        ingredients: data
      };
    } catch (e) {
      if (e instanceof Error) {
        return rejectWithValue(e.message);
      }
      return rejectWithValue('Не удалось оформить заказ');
    }
  }
);

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'order/fetchOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload;
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
