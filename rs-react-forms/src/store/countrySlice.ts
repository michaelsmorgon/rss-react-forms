import { createSlice } from '@reduxjs/toolkit';
import { countries } from '../utils/constants';

const countriesSlice = createSlice({
  name: 'countries',
  initialState: countries,
  reducers: {},
});

export default countriesSlice.reducer;
