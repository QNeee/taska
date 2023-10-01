import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_KEY, FETCHHOST } from '../../fetchHost';

axios.defaults.baseURL = FETCHHOST;
export const fetchByName = createAsyncThunk(
    'app/fetchName',
    async (name: string, { rejectWithValue, dispatch }) => {
        try {
            const result = await axios.get(`${encodeURIComponent(name)}&key=${API_KEY}`);
            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const fetchByCord = createAsyncThunk(
    'app/fetchByCord',
    async (cord: string[], { rejectWithValue, dispatch }) => {
        try {
            const result = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cord[0]}+${cord[1]}&key=${API_KEY}`);

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
