import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchByCord, fetchByName } from './appOperations';
export interface IDataResults {
    formatted: string,
    geometry: { lat: number, lng: number }
}
export interface IPolyLines {
    lat: number,
    lng: number
}
export interface IPolyLinesArr {
    id?: string;
    owner?: string;
    start?: IPolyLines;
    end?: IPolyLines;
    to?: string;
}
export interface IDrawArr {
    type: string;
    lat: number;
    lng: number;
    id: string;
    role?: string;
}
export interface IAppState {
    position: [number, number];
    loading: boolean;
    error: unknown;
    dataResult: IDataResults[] | null;
    drawItem: string;
    drawArrLines: IDrawArr[];
    drawArrCircle: IDrawArr[];
    allData: IDrawArr[];
    drag: boolean;
    menuOpen: boolean;
    drawItemLatLng: { lat: number, lng: number };
    circleMenu: boolean;
    circleMenuOpen: boolean;
    generalId: string;
    polylines: IPolyLinesArr[];
    tempPoly: IPolyLinesArr;
    addLine: boolean;
}
const initialState: IAppState = {
    position: [51.505, -0.09],
    error: null,
    loading: false,
    dataResult: [],
    drawItem: '',
    drawArrLines: [],
    drawArrCircle: [],
    allData: [],
    drag: false,
    menuOpen: false,
    circleMenuOpen: false,
    drawItemLatLng: { lat: 0, lng: 0 },
    circleMenu: false,
    generalId: '',
    polylines: [],
    tempPoly: {},
    addLine: false
}

export const appSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changePosition: (state, action: PayloadAction<{ lat: number, lng: number }>) => {
            state.position = [action.payload.lat, action.payload.lng];
        },
        changeDrawItem: (state, { payload }) => {
            state.drawItem = payload;
        },
        makeDrawLine: (state, { payload }) => {
            state.drawArrLines.push(payload);
            state.allData.push(payload);
        },
        makeUndraw: (state, { payload }) => {
            const index = state.drawArrLines.findIndex(item => item === payload);
            if (payload.type === 'line') {
                state.drawArrLines.splice(index, 1);
            } else {
                state.drawArrCircle.splice(index, 1);
            }
            state.allData.splice(state.allData.length - 1, 1);
        },
        makeDrawCircle: (state, { payload }) => {
            state.drawArrCircle.push(payload);
            state.allData.push(payload);
        },
        setDrag: (state, { payload }) => {
            state.drag = payload;
        },
        dragLine: (state, { payload }) => {
            if (payload.index >= 0 && payload.index < state.drawArrCircle.length) {
                state.drawArrCircle[payload.index] = payload.updatedObject;
                state.allData[payload.index] = payload.updatedObject;
            }
        },
        setGeneralMenu: (state, { payload }) => {
            state.menuOpen = payload;
        },
        setCircleMenu: (state, { payload }) => {
            state.circleMenu = payload;
        },
        setCircleMenuOpen: (state, { payload }) => {
            state.circleMenuOpen = payload;
        },
        setDrawItemLatLng: (state, { payload }) => {
            state.drawItemLatLng.lat = payload.lat;
            state.drawItemLatLng.lng = payload.lng;
        },
        setGeneral: (state, { payload }) => {
            for (let i = 0; i < state.drawArrCircle.length; i++) {
                if (state.drawArrCircle[i].id === payload.id) {
                    state.drawArrCircle[i].role = 'general';
                } else {
                    state.drawArrCircle[i].role = ''
                }
            }
        },
        setId: (state, { payload }) => {
            console.log(payload);
            state.generalId = payload
        },
        addPolyLines: (state, { payload }) => {
            state.tempPoly = payload
        },
        addPolyLinesToArr: (state, { payload }) => {
            state.polylines.push(payload);
        },
        updatePoly: (state, { payload }) => {
            console.log(payload);
            state.polylines = payload.newArr;
            state.drawArrCircle.splice(payload.indexCircle, 1, payload.obj1);
        },
        setAddLine: (state, { payload }) => {
            state.addLine = payload;
        },
        deleteCircle: (state, { payload }) => {
            state.drawArrCircle.splice(payload.idx, 1);
            state.polylines = payload.newArr;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchByName.fulfilled, (state, { payload }) => {
                state.dataResult = payload.data.results;
                state.loading = false;
            })
            .addCase(fetchByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(fetchByCord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchByCord.fulfilled, (state, { payload }) => {
                state.dataResult = payload.data.results;
                state.loading = false;
            })
            .addCase(fetchByCord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }

});
export const { changePosition, setAddLine, deleteCircle, updatePoly, addPolyLinesToArr, setId, addPolyLines, setCircleMenuOpen, setGeneral, setDrawItemLatLng, setCircleMenu, changeDrawItem, makeDrawLine, makeUndraw, setGeneralMenu, makeDrawCircle, dragLine, setDrag } = appSlice.actions;