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
    index?: number;
    color?: string;
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
    showOwnerLines: boolean;
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
    showOwnerLines: false
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
        clearData: (state, { payload }) => {
            state.allData = [];
            state.tempItems = [];
            state.restoreAllData = [];
        },
        makeUndraw: (state, { payload }) => {
            if (payload.type) {
                const removedCircle = state.drawArrCircle.pop();
                if (removedCircle) {
                    const indexToRemove = state.polylines.findIndex(item => item.id === removedCircle.id);
                    if (indexToRemove !== -1) {
                        state.polylines.splice(indexToRemove, 1);
                    }
                    state.restoreAllData.push(removedCircle);
                    const indexToRemoveFromAllData = state.allData.findIndex(item => item.id === removedCircle.id);
                    if (indexToRemoveFromAllData !== -1) {
                        state.allData.splice(indexToRemoveFromAllData, 1);
                    }
                }
            } else {
                const removedPolyline = state.polylines.pop();
                if (removedPolyline) {
                    const indexToRemove = state.drawArrCircle.findIndex(item => item.id === removedPolyline.id);
                    if (indexToRemove !== -1) {
                        state.drawArrCircle.splice(indexToRemove, 1);
                    }
                    state.restoreAllData.push(removedPolyline as IDrawArr);
                    const indexToRemoveFromAllData = state.allData.findIndex(item => item.id === removedPolyline.id);
                    if (indexToRemoveFromAllData !== -1) {
                        console.log(indexToRemoveFromAllData);
                        state.allData.splice(indexToRemoveFromAllData, 1);
                    }
                }
            }
        },

        makeRestoreUndraw: (state, { payload }) => {
            const item = state.restoreAllData.pop();
            if (payload.type) {
                state.drawArrCircle.push(item as IDrawArr);
            } else {
                state.polylines.push(item as IDrawArr);
            }
            state.allData.push(item as IDrawArr);
        },
        makeDrawCircle: (state, { payload }) => {
            state.drawArrCircle.push(payload);
            state.allData.push(payload);
        },
        setDrag: (state, { payload }) => {
            state.drag = payload;
        },
        setShowOwnerLines: (state, { payload }) => {
            state.showOwnerLines = payload;
        },
        dragLine: (state, { payload }) => {
            if (payload.indexCircle >= 0 && payload.indexCircle < state.drawArrCircle.length) {
                state.drawArrCircle[payload.indexCircle] = payload.obj;
                state.allData[!payload.allDataIndex ? payload.indexCircle : payload.allDataIndex] = payload.obj;
            }
            if (payload.newArr && payload.newArr.length > 0) {
                state.polylines = payload.newArr;
                state.allData = state.allData.map((item) => {
                    const matchingItem = payload.newArr.find((newItem: any) => newItem.id === item.id);
                    return matchingItem || item;
                });
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
            state.drawArrCircle.splice(payload.indexCircle, 1, payload.obj);
            if (payload.newArr.length > 0) {
                state.polylines = payload.newArr;
            }
        },
        setAddLine: (state, { payload }) => {
            state.addLine = payload;
        },
        deleteCircle: (state, { payload }) => {
            state.restoreAllData.push(state.drawArrCircle[payload.index]);
            state.allData.splice(payload.index, 1);
            state.drawArrCircle.splice(payload.index, 1);
            if (payload.polyIndexes.length > 0) {
                const itemsToAdd = payload.polyIndexes.map((index: number) => state.polylines[index]);
                state.restoreAllData = [...state.restoreAllData, ...itemsToAdd];
                state.polylines = state.polylines.filter((_, index) => !payload.polyIndexes.includes(index));
                const startIndex = (state.allData.length - 1) - (payload.polyIndexes.length - 1);
                const deleteCount = payload.polyIndexes.length;
                state.allData.splice(startIndex, deleteCount);
            }
            // state.drawArrCircle.splice(payload.idx, 1);
            // state.polylines = payload.newArr;
            // state.restoreAllData.push(payload.item);
            // state.allData.splice(payload.idx, 1);
            // state.tempItems.push({ id: payload.item.id, index: payload.idx });
            // if (payload.unmatchedItems) {
            //     state.allData = state.allData.filter(item => {
            //         return !payload.unmatchedItems.some((unmatchedItem: IPolyLinesArr) => {
            //             return item.id === unmatchedItem.id;
            //         });
            //     });
            //     for (let i = 0; i < payload.unmatchedItems.length; i++) {
            //         state.restoreAllData.push(payload.unmatchedItems[i]);
            //         state.tempItems.push({ id: payload.unmatchedItems.id, index: payload.indexArrPolylines[i] });
            //     }
            // }
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
export const { clearData, changePosition, setShowOwnerLines, makeRestoreUndraw, setAddLine, deleteCircle, updatePoly, addPolyLinesToArr, setId, addPolyLines, setCircleMenuOpen, setGeneral, setDrawItemLatLng, setCircleMenu, changeDrawItem, makeDrawLine, makeUndraw, setGeneralMenu, makeDrawCircle, dragLine, setDrag } = appSlice.actions;