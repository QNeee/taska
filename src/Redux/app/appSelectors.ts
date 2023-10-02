import { RootState } from "../store";

export const getPosition = (state: RootState) => state.app.position;
export const getDataResults = (state: RootState) => state.app.dataResult;
export const getDrawItem = (state: RootState) => state.app.drawItem;
export const getDrawArrLines = (state: RootState) => state.app.drawArrLines;
export const getDrawArrCircles = (state: RootState) => state.app.drawArrCircle;
export const getAllDrawData = (state: RootState) => state.app.allData;
export const getDrag = (state: RootState) => state.app.drag;
export const getMenu = (state: RootState) => state.app.menuOpen;
export const getDrawItemLatLng = (state: RootState) => state.app.drawItemLatLng;
export const getCircleMenu = (state: RootState) => state.app.circleMenu;
export const getCircleMenuOpen = (state: RootState) => state.app.circleMenuOpen;
export const getGeneralId = (state: RootState) => state.app.generalId;
export const getPolyLines = (state: RootState) => state.app.polylines;
export const getTempPoly = (state: RootState) => state.app.tempPoly;
export const getAddLine = (state: RootState) => state.app.addLine;
export const getResotredData = (state: RootState) => state.app.restoreAllData;
export const getTempItems = (state: RootState) => state.app.tempItems;