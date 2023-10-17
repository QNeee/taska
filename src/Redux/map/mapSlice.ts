import { createSlice } from "@reduxjs/toolkit";
import { ICustomPolyline } from "../../Polylines";
import { LatLng } from "leaflet";
import { ICustomMarker } from "../../Mufts";
import { ICustomCube } from "../../Cubes";
import { IVector } from "../../Vector";
// import { ICustomUnderCube } from "../../UnderCubes";

export interface ICustomLatLng {
    lat: number;
    lng: number;
}
export interface IXyObj {
    x: number,
    y: number
}
export interface IUpdateObjMufts {
    index: number,
    newArr: ICustomPolyline[],
    mufts: ICustomMarker[],
}
export interface IUpdateObjCubes {
    index: number,
    newArr: ICustomPolyline[],
    cubes: ICustomMarker[],
}
export interface ITempPolyline extends ICustomPolyline {
    cubeId?: string
}

export interface ICubicHelper {
    [key: string]: string[]
}
export interface ILineStart extends LatLng {
    id?: string,
    latlng: LatLng
}
export interface ICubInfo {
    cubeId: string
}
export interface IItemInfoPoly {
    owner: string;
    to: string;
    cubeId?: string;
}

export interface IItemInfoCube {
    toCube: string | undefined;
    ownerCube: string;
}
interface IMapState {
    muftaMenuOpen: boolean;
    polylineMenuOpen: boolean;
    tempPolylines: ICustomPolyline[];
    id: string;
    mufts: ICustomMarker[];
    cubeInfo: ICubInfo | null
    cubes: ICustomCube[];
    drag: boolean;
    showOwnerLines: boolean;
    polyLines: ICustomPolyline[];
    lineStart: ILineStart | null;
    contextMenuXY: IXyObj | null;
    menuOpen: boolean;
    itemMenu: boolean;
    vectors: IVector[];
    cubicPoly: ICubicHelper;
    // underCubes: ICustomUnderCube[];
    countOwner: number;
    countTo: number;
    // tempUnderCubes: ICustomUnderCube[];
    tempLines: ICustomPolyline[];
    hideCubes: boolean;
}
const initialState: IMapState = {
    muftaMenuOpen: false,
    polylineMenuOpen: false,
    tempPolylines: [],
    id: '',
    lineStart: null,
    cubeInfo: null,
    mufts: [],
    drag: false,
    showOwnerLines: false,
    polyLines: [],
    contextMenuXY: null,
    cubes: [],
    menuOpen: false,
    itemMenu: false,
    cubicPoly: {},
    vectors: [],
    // underCubes: [],
    countOwner: 0,
    countTo: 0,
    // tempUnderCubes: [],
    tempLines: [],
    hideCubes: false
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setHideCubes: (state, { payload }) => {
            state.hideCubes = payload;
        },
        setCubDragging: (state, { payload }) => {
            state.cubes = payload;
        },
        setCountOwner: (state, { payload }) => {
            state.countOwner = state.countOwner + 1;
        },
        setCountTo: (state, { payload }) => {
            state.countTo = state.countTo + 1;
        },
        // setUnderCube: (state, { payload }) => {
        //     state.underCubes = payload;
        // },
        addCubePoly: (state, { payload }) => {
            state.cubicPoly = payload;
        },
        updateCubesDelete: (state, { payload }) => {
            state.cubes = payload.cubes;
            state.polyLines = payload.polyLines;
        },
        addVector: (state, { payload }) => {
            if (Array.isArray(payload)) {
                state.vectors = payload;
            } else {
                state.vectors.push(payload);
            }
        },
        setPolysOwner: (state, { payload }) => {
            state.polyLines = payload;
        },
        updateCubes: (state, { payload }) => {
            state.cubes = payload.cubes;
            if (payload.newArr.length > 0) {
                state.polyLines = payload.newArr;
            }
        },
        drawMufta: (state, { payload }) => {
            state.mufts.push(payload);
        },
        updateMufta: (state, { payload }) => {
            const owner = state.mufts.findIndex(item => item.id === payload.idOwner);
            const to = state.mufts.findIndex(item => item.id === payload.idTo);
            state.mufts.splice(to, 1, payload.data[0]);
            state.mufts.splice(owner, 1, payload.data[1]);
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
            if (Array.isArray(payload)) {
                state.polyLines = payload;
            } else {
                state.polyLines.push(payload);
            }
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
            state.mufts = payload.mufts;
            state.polyLines = payload.polyLines;
            state.cubes = payload.cubes;
        },
        drawCube: (state, { payload }) => {
            state.cubes = payload;
        },
    }

    ,
    extraReducers: (builder) => {
    }

});

export const { setHideCubes, updateMufta, setCubDragging, setCountTo, setCountOwner, addCubePoly, addVector, updateCubesDelete, setPolysOwner, updateCubes, drawCube, deleteMufta, setItemMenu, setPolylineMenuOpen, setMuftaMenuOpen, changePolylineWeight, setGeneralMenu, setDrag, updatePoly, setContextMenuXY, drawPolyline, setLineStart, drawMufta, setId, setShowOwnerLines } = mapSlice.actions;