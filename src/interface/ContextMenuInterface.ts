import { LeafletMouseEvent } from "leaflet";
import { IPolyLinesArr, setClickAccept, setContextMenuXY, setCubeMenu, setDrawItemLatLng, setDrawLine, setGeneralMenu, setMuftaMenuOpen, setPolylineMenuOpen } from "../Redux/app/appSlice";
import { Lines } from "../Line";


export interface IDrawItemLatLng {
    lat: number,
    lng: number
}

export class ContextMenuInterface {

    static handleClick(e: LeafletMouseEvent, dispatch: Function, lineDraw: boolean, clickAccept: boolean, tempPoly: IPolyLinesArr) {
        if (lineDraw && clickAccept) {
            const latlng = e.latlng;
            Lines.makePoly(tempPoly, latlng, dispatch);
            dispatch(setDrawLine(false));
            dispatch(setClickAccept(false));
        }
    }
    static handleContextMenu(e: LeafletMouseEvent, dispatch: Function, generalMEnu: boolean, itemMenu: boolean, cubeMenu: boolean) {
        e.originalEvent.preventDefault();
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const obj = { lat, lng };
        dispatch(setDrawItemLatLng(obj));
        dispatch(setContextMenuXY({ x: e.originalEvent.clientX, y: e.originalEvent.clientY }));
        if (!generalMEnu && !itemMenu && !cubeMenu) {
            dispatch(setMuftaMenuOpen(false));
            dispatch(setPolylineMenuOpen(false));
            dispatch(setCubeMenu(false));
            dispatch(setGeneralMenu(true));
        }

    }
}