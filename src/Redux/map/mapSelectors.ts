import { RootState } from "../store";


export const getMufts = (state: RootState) => state.map.mufts;
export const getDrag = (state: RootState) => state.map.drag;
export const getShowOnwerLines = (state: RootState) => state.map.showOwnerLines;
export const getPolyLines = (state: RootState) => state.map.polyLines;
export const getLineStart = (state: RootState) => state.map.lineStart;
export const getId = (state: RootState) => state.map.id;
export const getContextMenuXY = (state: RootState) => state.map.contextMenuXY;
export const getGeneralMenu = (state: RootState) => state.map.menuOpen;
export const getMuftaMenuOpen = (state: RootState) => state.map.muftaMenuOpen;
export const getPolylineMenuOpen = (state: RootState) => state.map.polylineMenuOpen;
export const getItemMenu = (state: RootState) => state.map.itemMenu;
export const getCubes = (state: RootState) => state.map.cubes;