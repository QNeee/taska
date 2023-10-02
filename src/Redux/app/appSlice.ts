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
export interface ITempItem {
    id: string,
    index: number
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
    owner?: string;
    to?: string;
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
    restoreAllData: IDrawArr[];
    tempItems: ITempItem[];
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
    restoreAllData: [],
    drag: false,
    menuOpen: false,
    circleMenuOpen: false,
    drawItemLatLng: { lat: 0, lng: 0 },
    circleMenu: false,
    generalId: '',
    polylines: [],
    tempPoly: {},
    addLine: false,
    tempItems: [],
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
            const index = state.drawArrCircle.findIndex(item => item.id === payload.data.id);
            const index1 = state.polylines.findIndex(item => item.id === payload.data.id);
            if (index !== -1) {
                state.drawArrCircle.splice(index, 1);
            } else {
                state.polylines.splice(index1, 1);
            }
            state.restoreAllData.push(state.allData[state.allData.length - 1]);
            state.allData.splice(state.allData.length - 1, 1);
            state.tempItems.push({ id: payload.item.id, index: payload.item.type ? index : index1 });
        },
        makeRestoreUndraw: (state, { payload }) => {
            const { index, newItem } = payload;
            if (newItem.type) {
                state.drawArrCircle.splice(index, 0, newItem);
            } else {
                state.polylines.splice(index, 0, newItem);
            }
            state.allData.push(newItem);
            state.restoreAllData.splice(state.restoreAllData.length - 1, 1);
            state.tempItems.splice(state.tempItems.length - 1, 1);
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
            state.generalId = payload
        },
        addPolyLines: (state, { payload }) => {
            state.tempPoly = payload
        },
        addPolyLinesToArr: (state, { payload }) => {
            state.polylines.push(payload);
            state.allData.push(payload);
        },
        updatePoly: (state, { payload }) => {
            state.polylines = payload.newArr;
            state.drawArrCircle.splice(payload.indexCircle, 1, payload.obj1);
        },
        setAddLine: (state, { payload }) => {
            state.addLine = payload;
        },
        deleteCircle: (state, { payload }) => {
            state.drawArrCircle.splice(payload.idx, 1);
            state.polylines = payload.newArr;
            state.allData.splice(payload.idx, 1);
            if (payload.unmatchedItems) {
                state.allData = state.allData.filter(item => {
                    return !payload.unmatchedItems.some((unmatchedItem: IPolyLinesArr) => {
                        return item.id === unmatchedItem.id;
                    });
                });
            }
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
export const { changePosition, makeRestoreUndraw, setAddLine, deleteCircle, updatePoly, addPolyLinesToArr, setId, addPolyLines, setCircleMenuOpen, setGeneral, setDrawItemLatLng, setCircleMenu, changeDrawItem, makeDrawLine, makeUndraw, setGeneralMenu, makeDrawCircle, dragLine, setDrag } = appSlice.actions;