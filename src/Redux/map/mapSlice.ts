import { createSlice } from "@reduxjs/toolkit";
import { ICustomPolyline } from "../../Polylines";
import { LatLng } from "leaflet";
import { ICustomMarker } from "../../Mufts";
import { ICustomCube } from "../../Cubes";

export interface ICustomLatLng {
    lat: number;
    lng: number;
}
export interface IXyObj {
    x: number,
    y: number
}
export interface IUpdateObj {
    index: number,
    newArr: ICustomPolyline[],
    mufts: ICustomMarker[],
}
export interface ILineStart extends LatLng {
    id?: string,
    latlng: LatLng
}
interface IMapState {
    muftaMenuOpen: boolean;
    polylineMenuOpen: boolean;
    id: string;
    mufts: ICustomMarker[];
    cubes: ICustomCube[];
    drag: boolean;
    showOwnerLines: boolean;
    polyLines: ICustomPolyline[];
    lineStart: ILineStart | null;
    contextMenuXY: IXyObj | null;
    menuOpen: boolean;
    itemMenu: boolean;
}
const initialState: IMapState = {
    muftaMenuOpen: false,
    polylineMenuOpen: false,
    id: '',
    lineStart: null,
    mufts: [],
    drag: false,
    showOwnerLines: false,
    polyLines: [],
    contextMenuXY: null,
    cubes: [],
    menuOpen: false,
    itemMenu: false,
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        drawMufta: (state, { payload }) => {
            state.mufts.push(payload);
        },
        setDrag: (state, { payload }) => {
            state.drag = payload;
        },
        setShowOwnerLines: (state, { payload }) => {
            state.showOwnerLines = payload;
        },
        setId: (state, { payload }) => {
            state.id = payload
        },
        setLineStart: (state, { payload }) => {
            state.lineStart = payload;
        },
        drawPolyline: (state, { payload }) => {
            state.polyLines.push(payload);
        },
        updatePoly: (state, { payload }) => {
            state.mufts = payload.mufts;
            if (payload.newArr.length > 0) {
                state.polyLines = payload.newArr;
            }
        },
        setContextMenuXY: (state, { payload }) => {
            state.contextMenuXY = payload;
        },
        setGeneralMenu: (state, { payload }) => {
            state.menuOpen = payload;
        },
        setMuftaMenuOpen: (state, { payload }) => {
            state.muftaMenuOpen = payload;
        },
        setPolylineMenuOpen: (state, { payload }) => {
            state.polylineMenuOpen = payload;
        },
        changePolylineWeight: (state, { payload }) => {
            state.polyLines = payload;
        },
        setItemMenu: (state, { payload }) => {
            state.itemMenu = payload;
        },
        deleteMufta: (state, { payload }) => {
            console.log(payload);
            state.mufts = payload;
        }
    }

    ,
    extraReducers: {}

});

export const { deleteMufta, setItemMenu, setPolylineMenuOpen, setMuftaMenuOpen, changePolylineWeight, setGeneralMenu, setDrag, updatePoly, setContextMenuXY, drawPolyline, setLineStart, drawMufta, setId, setShowOwnerLines } = mapSlice.actions;