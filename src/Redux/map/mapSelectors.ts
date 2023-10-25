import { RootState } from "../store";


export const getMufts = (state: RootState) => state.map.mufts;
export const getDrag = (state: RootState) => state.map.drag;
export const getShowOnwerLines = (state: RootState) => state.map.showOwnerLines;
export const getPolyLines = (state: RootState) => state.map.polyLines;
export const getLineStart = (state: RootState) => state.map.lineStart;
export const getId = (state: RootState) => state.map.id;
export const getContextMenuXY = (state: RootState) => state.map.contextMenuXY;
export const getCubes = (state: RootState) => state.map.cubes;
export const getHideCubes = (state: RootState) => state.map.hideCubes;
export const getWardrobes = (state: RootState) => state.map.wardrobes;
export const getContextMenu = (state: RootState) => state.map.contextMenuItem;
export const getPolylineInfoModal = (state: RootState) => state.map.polylineInfoModal;
export const getFiberOpticsMenu = (state: RootState) => state.map.choseCountFiberOpticsMenu;
export const getOpticsColors = (state: RootState) => state.map.colors;
export const getTrack = (state: RootState) => state.map.track;
export const getOldCubeLatLng = (state: RootState) => state.map.oldCubeLatLng;
export const getTrackData = (state: RootState) => state.map.trackData;
export const getTrackIndex = (state: RootState) => state.map.trackIndex;
export const getMainLine = (state: RootState) => state.map.mainLineId;
export const getChangeLineModal = (state: RootState) => state.map.changeLineModal;
export const getMuftaInfoModal = (state: RootState) => state.map.muftaInfoModal;
export const getFiberInfoModal = (state: RootState) => state.map.fiberInfoModal;