import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchByCord, fetchByName } from './appOperations';
import { ICube } from '../../Cube';
export interface IDataResults {
    formatted: string,
    geometry: { lat: number, lng: number }
}
export interface ICustomMarker extends L.Marker {
    id?: string;
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
    middle?: IPolyLines;
    weight?: null;
    cubeId?: string;
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
    mufts: ICustomMarker[],


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
    muftaMenuOpen: boolean;
    polylineMenuOpen: boolean;
    drawItemLatLng: { lat: number, lng: number };
    circleMenu: boolean;
    circleMenuOpen: boolean;
    id: string;
    polylines: IPolyLinesArr[];
    cubes: ICube[],
    tempPoly: IPolyLinesArr;
    addLine: boolean;
    restoreAllData: IDrawArr[];
    tempItems: ITempItem[];
    showOwnerLines: boolean;
    polylineWeight: number;
    contextMenuX: number;
    contextMenuY: number;
    dragCube: boolean;
    drawLine: boolean;
    cursor: string;
    clickAccept: boolean;
    cubeMenu: boolean;
}
const initialState: IAppState = {
    mufts: [],



    position: [51.505, -0.09],
    error: null,
    loading: false,
    dataResult: [],
    drawItem: '',
    drawArrLines: [],
    drawArrCircle: [],
    allData: [],
    restoreAllData: [],
    cubes: [],
    drag: false,
    menuOpen: false,
    muftaMenuOpen: false,
    polylineMenuOpen: false,
    circleMenuOpen: false,
    drawItemLatLng: { lat: 0, lng: 0 },
    circleMenu: false,
    id: '',
    polylines: [],
    tempPoly: {},
    addLine: false,
    tempItems: [],
    showOwnerLines: false,
    polylineWeight: 4,
    contextMenuX: 0,
    contextMenuY: 0,
    dragCube: false,
    drawLine: false,
    cursor: 'default',
    clickAccept: false,
    cubeMenu: false,
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
        drawMuft: (state, { payload }) => {
            state.mufts.push(payload);
        },
        setCursor: (state, { payload }) => {
            state.cursor = payload;
        },
        setClickAccept: (state, { payload }) => {
            state.clickAccept = payload;
        },
        setCubeMenu: (state, { payload }) => {
            state.cubeMenu = payload;
        },
        makeDrawLine: (state, { payload }) => {
            state.drawArrLines.push(payload);
            state.allData.push(payload);
        },
        setDrawLine: (state, { payload }) => {
            state.drawLine = payload;
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
        makeDrawCube: (state, { payload }) => {
            state.cubes.push(payload.obj);
            state.polylines = payload.newArr;
            state.allData.push(payload.obj);
            // if (payload.newArr && payload.newArr.length > 0) {
            //     state.cubes.push(payload.obj);
            //     state.polylines = payload.newArr;
            // } else {
            //     state.polylines.splice(payload.index, 1);
            //     state.polylines.push(payload.lineOwner);
            //     state.polylines.push(payload.lineTo);
            //     state.allData.push(payload.obj);
            //     state.cubes.push(payload.obj);
            // }

        },
        makeDrawCircle: (state, { payload }) => {
            state.drawArrCircle.push(payload);
            state.allData.push(payload);
        },
        setShowOwnerLines: (state, { payload }) => {
            state.showOwnerLines = payload;
        },
        dragLine: (state, { payload }) => {
            if (payload.indexCircle >= 0 && payload.indexCircle < state.drawArrCircle.length) {
                if (payload.obj.type === 'mufta') {
                    state.drawArrCircle[payload.indexCircle] = payload.obj;
                } else if (payload.obj.type === 'cube') {
                    state.cubes[payload.indexCircle] = payload.obj;
                }
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
        setContextMenuXY: (state, { payload }) => {
            state.contextMenuX = payload.x;
            state.contextMenuY = payload.y;
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
        setDragCube: (state, { payload }) => {
            state.dragCube = payload;
        },
        changePolylineWeight: (state, { payload }) => {
            state.polylines.splice(payload.index, 1, payload.newItem);
        },
        addPolyLines: (state, { payload }) => {
            state.tempPoly = payload
        },
        addPolyLinesToArr: (state, { payload }) => {
            state.polylines.push(payload);
            state.allData.push(payload);
        },

        setAddLine: (state, { payload }) => {
            state.addLine = payload;
        },
        setMuftaMenuOpen: (state, { payload }) => {
            state.muftaMenuOpen = payload;
        },
        setPolylineMenuOpen: (state, { payload }) => {
            state.polylineMenuOpen = payload;
        },
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
export const { setCubeMenu, setClickAccept, setCursor, setDrawLine, setDragCube, makeDrawCube, clearData, changePosition, makeRestoreUndraw, setAddLine, changeDrawItem, makeDrawLine, makeUndraw, makeDrawCircle, dragLine } = appSlice.actions;