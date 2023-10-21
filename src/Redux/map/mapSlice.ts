import { createSlice } from "@reduxjs/toolkit";
import { ICustomPolyline } from "../../Polylines";
import { LatLng } from "leaflet";
import { ICustomMarker } from "../../Mufts";
import { ICustomCube } from "../../Cubes";
import { ICustomWardrobe } from "../../Wardrobe";
import { IData } from "../../components/Modal/Modal";
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
}
export type Color =
    | 'blue'
    | 'orange'
    | 'green'
    | 'brown'
    | 'gray'
    | 'white'
    | 'red'
    | 'black'
    | 'yellow'
    | 'purple'
    | 'pink'
    | 'turquoise';

const colors: Color[] = [
    'blue',
    'orange',
    'green',
    'brown',
    'gray',
    'white',
    'red',
    'black',
    'yellow',
    'purple',
    'pink',
    'turquoise',
];

export interface IItemInfoCube {
    toCube: string | undefined;
    ownerCube: string;
}
export interface IContextMenuItem {
    poly: boolean;
    cube: boolean;
    muft: boolean;
    general: boolean;
    wardrobes: boolean;
    item: boolean;
    fiber: boolean;
}
export interface ITrackObj {
    color: string,
    idOwner: string,
    track: boolean,
    index: number,
}
interface IMapState {
    id: string;
    mufts: ICustomMarker[];
    cubeInfo: ICubInfo | null
    cubes: ICustomCube[];
    drag: boolean;
    showOwnerLines: boolean;
    polyLines: ICustomPolyline[];
    lineStart: ILineStart | null;
    contextMenuXY: IXyObj | null;
    contextMenuItem: IContextMenuItem;
    wardrobes: ICustomWardrobe[];
    hideCubes: boolean;
    infoModal: boolean;
    choseCountFiberOpticsMenu: boolean;
    colors: Color[];
    track: ITrackObj;
    oldCubeLatLng: LatLng | null;
    trackData: IData[];
    trackIndex: number;
    mainLineId: string;
}
const initialState: IMapState = {
    id: '',
    lineStart: null,
    cubeInfo: null,
    mufts: [],
    drag: false,
    contextMenuItem: { cube: false, general: false, poly: false, muft: false, wardrobes: false, item: false, fiber: false },
    showOwnerLines: false,
    wardrobes: [],
    polyLines: [],
    contextMenuXY: null,
    cubes: [],
    hideCubes: false,
    infoModal: false,
    colors,
    choseCountFiberOpticsMenu: false,
    track: { color: '', idOwner: '', track: false, index: 0 },
    oldCubeLatLng: null,
    trackData: [],
    trackIndex: 0,
    mainLineId: ''
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        updateMuftFibers: (state, { payload }) => {
            const indexOwner = state.mufts.findIndex(item => item.id === payload.owner.id);
            state.mufts.splice(indexOwner, 1, payload.owner);
            const indexTo = state.mufts.findIndex(item => item.id === payload.to.id);
            state.mufts.splice(indexTo, 1, payload.to);
        },
        setMainLineId: (state, { payload }) => {
            state.mainLineId = payload;
        },
        setTrackIndex: (state, { payload }) => {
            state.trackIndex = payload;
        },
        setTrackData: (state, { payload }) => {
            state.trackData = payload;
        },
        updateOptics: (state, { payload }) => {
            state.mufts.splice(payload.index, 1, payload.obj);
        },
        setOldCubeLatLng: (state, { payload }) => {
            state.oldCubeLatLng = payload;
        },
        setTrack: (state, { payload }) => {
            state.track = payload;
        },
        setFiberOpticsMenu: (state, { payload }) => {
            state.choseCountFiberOpticsMenu = payload;
        },
        setInfoModal: (state, { payload }) => {
            state.infoModal = payload;
        },
        setContextMenu: (state, { payload }) => {
            state.contextMenuItem = payload;
        },
        drawWardrobe: (state, { payload }) => {
            state.wardrobes.push(payload);
        },
        setToggleCoordsApply: (state, { payload }) => {
            if (payload.data.type === 'muft') {
                state.mufts.splice(payload.index, 1, payload.data);
            } else {
                state.wardrobes.splice(payload.index, 1, payload.data);
            }
        },
        setHideCubes: (state, { payload }) => {
            state.hideCubes = payload;
        },
        setCubDragging: (state, { payload }) => {
            state.cubes = payload;
        },

        updateCubesDelete: (state, { payload }) => {
            state.cubes = payload.cubes;
            state.polyLines = payload.polyLines;
        },
        setPolysOwner: (state, { payload }) => {
            state.polyLines = payload;
        },
        updateCubes: (state, { payload }) => {
            state.mufts.splice(payload.index, 1, payload.muft);
            state.cubes = payload.cubes;
            if (payload.newArr.length > 0) {
                state.polyLines = payload.newArr;
            }
        },
        drawMufta: (state, { payload }) => {
            state.mufts.push(payload);
        },
        updateWardrobe: (state, { payload }) => {
            const owner = state.mufts.findIndex(item => item.id === payload.idOwner);
            const wardrobe = state.wardrobes.findIndex(item => item.id === payload.idTo);
            state.wardrobes.splice(wardrobe, 1, payload.data[0]);
            state.mufts.splice(owner, 1, payload.data[1]);
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
            if (payload.wardrobes) state.wardrobes = payload.wardrobes;
        },
        setContextMenuXY: (state, { payload }) => {
            state.contextMenuXY = payload;
        },
        changePolylineWeight: (state, { payload }) => {
            state.polyLines = payload;
        },
        deleteWardrobe: (state, { payload }) => {
            console.log(payload);
            state.mufts = payload.mufts;
            state.polyLines = payload.polyLines;
            state.cubes = payload.cubes;
            state.wardrobes = payload.wardrobes;
        },
        deleteMufta: (state, { payload }) => {
            state.mufts = payload.mufts;
            state.polyLines = payload.polyLines;
            state.cubes = payload.cubes;
            state.wardrobes = payload.wardrobes;
        },
        drawCube: (state, { payload }) => {
            state.cubes = payload;
        },
    }

    ,
    extraReducers: (builder) => {
    }

});

export const { deleteWardrobe, updateWardrobe, updateMuftFibers, setMainLineId, setTrackIndex, setTrackData, updateOptics, setOldCubeLatLng, setTrack, setFiberOpticsMenu, setInfoModal, setContextMenu, drawWardrobe, setToggleCoordsApply, setHideCubes, updateMufta, setCubDragging, updateCubesDelete, setPolysOwner, updateCubes, drawCube, deleteMufta, changePolylineWeight, setDrag, updatePoly, setContextMenuXY, drawPolyline, setLineStart, drawMufta, setId, setShowOwnerLines } = mapSlice.actions;